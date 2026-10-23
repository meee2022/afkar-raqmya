import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./adminAuth";

const kind = v.union(v.literal("invoice"), v.literal("quote"));
const status = v.union(v.literal("draft"), v.literal("sent"), v.literal("accepted"), v.literal("paid"), v.literal("cancelled"));
const fields = {
  clientName: v.string(),
  clientCompany: v.optional(v.string()),
  clientPhone: v.optional(v.string()),
  clientEmail: v.optional(v.string()),
  issueDate: v.string(),
  dueDate: v.optional(v.string()),
  items: v.array(v.object({ description: v.string(), qty: v.number(), unitPrice: v.number() })),
  discount: v.number(),
  paidAmount: v.optional(v.number()),
  notes: v.optional(v.string()),
};

// Server-side guard: the UI also checks this, but never trust the client.
function validate(d: { clientName: string; items: { qty: number; unitPrice: number }[]; discount: number; paidAmount?: number }) {
  if (!d.clientName.trim()) throw new Error("اسم العميل مطلوب");
  if (d.items.length === 0) throw new Error("أضف بندًا واحدًا على الأقل");
  if (d.items.some(i => !(i.qty >= 0) || !(i.unitPrice >= 0))) throw new Error("الكمية والسعر لا يمكن أن يكونا بالسالب");
  const subtotal = d.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  if (!(d.discount >= 0) || d.discount > subtotal) throw new Error("الخصم يجب أن يكون بين صفر والمجموع");
  if (d.paidAmount !== undefined && (!(d.paidAmount >= 0) || d.paidAmount > subtotal - d.discount)) throw new Error("المدفوع مقدمًا أكبر من الإجمالي");
}

// YYYY-MM-DD in Qatar time (UTC+3), so late-night documents get the right date
const qatarToday = () => new Date(Date.now() + 3 * 3600_000).toISOString().slice(0, 10);

// INV-2026-001 / QT-2026-001, numbered per kind per year
async function nextNumber(ctx: any, k: "invoice" | "quote", issueDate: string) {
  const year = Number(issueDate.slice(0, 4)) || new Date().getFullYear();
  const last = await ctx.db
    .query("agencyDocuments")
    .withIndex("by_kind_year_seq", (q: any) => q.eq("kind", k).eq("year", year))
    .order("desc")
    .first();
  const seq = (last?.seq ?? 0) + 1;
  const prefix = k === "invoice" ? "INV" : "QT";
  return { year, seq, number: `${prefix}-${year}-${String(seq).padStart(3, "0")}` };
}

export const list = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    const rows = await ctx.db.query("agencyDocuments").collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const get = query({
  args: { token: v.string(), id: v.id("agencyDocuments") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: { token: v.string(), kind, ...fields },
  handler: async (ctx, { token, kind: k, ...data }) => {
    await requireAdmin(ctx, token);
    validate(data);
    const num = await nextNumber(ctx, k, data.issueDate);
    const now = Date.now();
    return await ctx.db.insert("agencyDocuments", { kind: k, ...num, ...data, status: "draft", createdAt: now, updatedAt: now });
  },
});

export const update = mutation({
  args: { token: v.string(), id: v.id("agencyDocuments"), ...fields },
  handler: async (ctx, { token, id, ...data }) => {
    await requireAdmin(ctx, token);
    const doc = await ctx.db.get(id);
    // Once sent, the amounts are what the client received: lock edits.
    if (!doc || doc.status !== "draft") throw new Error("لا يمكن تعديل مستند بعد إرساله");
    validate(data);
    await ctx.db.patch(id, { ...data, updatedAt: Date.now() });
  },
});

export const setStatus = mutation({
  args: { token: v.string(), id: v.id("agencyDocuments"), status },
  handler: async (ctx, { token, id, status: s }) => {
    await requireAdmin(ctx, token);
    const doc = await ctx.db.get(id);
    // Going back to draft would unlock edits on a document the client already has.
    if (doc && doc.status !== "draft" && s === "draft") throw new Error("لا يمكن إرجاع مستند مُرسل إلى مسودة");
    await ctx.db.patch(id, { status: s, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("agencyDocuments") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const doc = await ctx.db.get(id);
    // Only drafts can be deleted; sent documents are cancelled so their number is never reused.
    if (doc && doc.status !== "draft") throw new Error("المستند المُرسل لا يُحذف — غيّر حالته إلى ملغاة");
    if (doc && (await ctx.db.query("agencyDocuments").withIndex("by_sourceQuote", q => q.eq("sourceQuoteId", id)).first()))
      throw new Error("عرض السعر هذا محوّل إلى فاتورة");
    if (doc) await ctx.db.delete(id);
  },
});

// Creates a new invoice from an accepted quote
export const convertToInvoice = mutation({
  args: { token: v.string(), id: v.id("agencyDocuments") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const quote = await ctx.db.get(id);
    if (!quote || quote.kind !== "quote") throw new Error("عرض السعر غير موجود");
    const existing = await ctx.db.query("agencyDocuments").withIndex("by_sourceQuote", q => q.eq("sourceQuoteId", id)).first();
    if (existing) return existing._id;
    const issueDate = qatarToday();
    const num = await nextNumber(ctx, "invoice", issueDate);
    const now = Date.now();
    await ctx.db.patch(id, { status: "accepted", updatedAt: now });
    return await ctx.db.insert("agencyDocuments", {
      kind: "invoice", ...num, status: "draft",
      clientName: quote.clientName, clientCompany: quote.clientCompany, clientPhone: quote.clientPhone, clientEmail: quote.clientEmail,
      issueDate, items: quote.items, discount: quote.discount, paidAmount: quote.paidAmount, notes: quote.notes,
      sourceQuoteId: id, createdAt: now, updatedAt: now,
    });
  },
});

export const getBilling = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    return (await ctx.db.query("agencyBillingInfo").first()) ?? null;
  },
});

export const upsertBilling = mutation({
  args: {
    token: v.string(),
    crNumber: v.optional(v.string()),
    bankName: v.optional(v.string()),
    accountName: v.optional(v.string()),
    iban: v.optional(v.string()),
    paymentTerms: v.optional(v.string()),
    quoteValidityDays: v.optional(v.number()),
  },
  handler: async (ctx, { token, ...data }) => {
    await requireAdmin(ctx, token);
    const row = await ctx.db.query("agencyBillingInfo").first();
    if (row) await ctx.db.patch(row._id, { ...data, updatedAt: Date.now() });
    else await ctx.db.insert("agencyBillingInfo", { ...data, updatedAt: Date.now() });
  },
});
