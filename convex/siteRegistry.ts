import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { requireAdmin } from "./adminAuth";
import {
  emptyRegistryInput,
  validCalendarDate,
  type RegistryInput,
} from "../shared/siteRegistry";

const fields = {
  name: v.string(),
  client: v.string(),
  siteUrl: v.string(),
  domain: v.string(),
  domainProvider: v.string(),
  renewalDate: v.string(),
  repositoryUrl: v.string(),
  repositoryName: v.string(),
  localPath: v.optional(v.string()),
  credentialReference: v.string(),
  services: v.array(
    v.object({
      provider: v.string(),
      account: v.string(),
      project: v.string(),
      dashboardUrl: v.string(),
    }),
  ),
  notes: v.string(),
  tags: v.array(v.string()),
  status: v.union(
    v.literal("unknown"),
    v.literal("live"),
    v.literal("development"),
    v.literal("paused"),
  ),
  needsReview: v.boolean(),
  pinned: v.boolean(),
  recordKey: v.optional(v.string()),
};

function cleanUrl(value: string) {
  if (!value.trim()) return "";
  try {
    const u = new URL(value.trim());
    if (!["https:", "http:"].includes(u.protocol) || u.username || u.password)
      throw new Error();
    // Account secrets belong in a password manager, never in bookmarked URLs.
    if (
      [...u.searchParams.keys()].some((k) =>
        /^(token|access_token|api_?key|password|secret|authorization)$/i.test(
          k,
        ),
      )
    )
      throw new Error();
    return u.href;
  } catch {
    throw new ConvexError(
      "اكتب رابطًا يبدأ بـ https://، دون كلمة مرور أو مفتاح سري داخل الرابط.",
    );
  }
}
function validate(input: RegistryInput): RegistryInput {
  const d = {
    ...input,
    name: input.name.trim(),
    client: input.client.trim(),
    domain: input.domain.trim(),
    domainProvider: input.domainProvider.trim(),
    repositoryName: input.repositoryName.trim(),
    localPath: (input.localPath ?? "").trim(),
    credentialReference: input.credentialReference.trim(),
    notes: input.notes.trim(),
    recordKey: input.recordKey?.trim() || undefined,
  };
  if (!d.name || d.name.length > 160)
    throw new ConvexError("اسم الموقع مطلوب وبحد أقصى 160 حرفًا.");
  if (d.localPath.length > 1000 || /[\u0000-\u001f]/.test(d.localPath))
    throw new ConvexError(
      "اكتب مسار مجلد المشروع في سطر واحد وبحد أقصى 1000 حرف.",
    );
  if (
    [
      d.client,
      d.domain,
      d.domainProvider,
      d.repositoryName,
      d.credentialReference,
    ].some((s) => s.length > 250) ||
    d.notes.length > 12000 ||
    (d.recordKey?.length ?? 0) > 200
  )
    throw new ConvexError("بعض البيانات طويلة جدًا. اختصرها قبل الحفظ.");
  if (d.renewalDate && !validCalendarDate(d.renewalDate))
    throw new ConvexError("راجع تاريخ تجديد الدومين.");
  if (
    d.domain &&
    !/^(?:[a-z0-9\u0600-\u06ff](?:[a-z0-9\u0600-\u06ff-]*[a-z0-9\u0600-\u06ff])?\.)+[a-z\u0600-\u06ff]{2,63}$/i.test(
      d.domain,
    )
  )
    throw new ConvexError(
      "اكتب الدومين فقط، مثل example.com، دون مسار أو https://.",
    );
  if (
    d.tags.length > 20 ||
    d.tags.some((t) => !t.trim() || t.length > 60) ||
    d.services.length > 20
  )
    throw new ConvexError("استخدم حتى 20 وسمًا و20 حساب خدمة لكل موقع.");
  d.siteUrl = cleanUrl(d.siteUrl);
  d.repositoryUrl = cleanUrl(d.repositoryUrl);
  d.services = d.services.map((s) => {
    if (
      !s.provider.trim() ||
      [s.provider, s.account, s.project].some((value) => value.length > 250)
    )
      throw new ConvexError(
        "اكتب اسم كل خدمة واختصر بيانات الحساب إلى 250 حرفًا.",
      );
    return {
      provider: s.provider.trim(),
      account: s.account.trim(),
      project: s.project.trim(),
      dashboardUrl: cleanUrl(s.dashboardUrl),
    };
  });
  d.tags = [...new Set(d.tags.map((t) => t.trim()))];
  return d;
}

export const list = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    return ctx.db
      .query("agencyWebsiteRegistry")
      .withIndex("by_updated")
      .order("desc")
      .collect();
  },
});
export const get = query({
  args: { token: v.string(), id: v.id("agencyWebsiteRegistry") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    return ctx.db.get(id);
  },
});
export const create = mutation({
  args: { token: v.string(), ...fields },
  handler: async (ctx, { token, ...input }) => {
    await requireAdmin(ctx, token);
    const data = validate(input);
    const now = Date.now();
    return ctx.db.insert("agencyWebsiteRegistry", {
      ...data,
      archived: false,
      revision: 1,
      createdAt: now,
      updatedAt: now,
    });
  },
});
export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("agencyWebsiteRegistry"),
    revision: v.number(),
    ...fields,
  },
  handler: async (ctx, { token, id, revision, ...input }) => {
    await requireAdmin(ctx, token);
    const row = await ctx.db.get(id);
    if (!row) throw new ConvexError("السجل غير موجود.");
    if (row.revision !== revision)
      throw new ConvexError(
        "تم تعديل السجل من جلسة أخرى. افتحه من جديد قبل الحفظ حتى لا تفقد التعديلات.",
      );
    await ctx.db.patch(id, {
      ...validate(input),
      revision: revision + 1,
      updatedAt: Date.now(),
    });
  },
});
export const setArchived = mutation({
  args: {
    token: v.string(),
    id: v.id("agencyWebsiteRegistry"),
    archived: v.boolean(),
    revision: v.number(),
  },
  handler: async (ctx, { token, id, archived, revision }) => {
    await requireAdmin(ctx, token);
    const row = await ctx.db.get(id);
    if (!row || row.revision !== revision)
      throw new ConvexError("تغير السجل. حدّث البيانات ثم حاول مرة أخرى.");
    await ctx.db.patch(id, {
      archived,
      revision: revision + 1,
      updatedAt: Date.now(),
    });
  },
});
export const importRecords = mutation({
  args: {
    token: v.string(),
    records: v.array(
      v.object({ ...fields, archived: v.optional(v.boolean()) }),
    ),
  },
  handler: async (ctx, { token, records }) => {
    await requireAdmin(ctx, token);
    if (records.length < 1 || records.length > 200)
      throw new ConvexError("استورد من سجل واحد إلى 200 سجل في المرة.");
    const cleaned = records.map(validate); // Validate all before inserting anything.
    const existing = await ctx.db.query("agencyWebsiteRegistry").collect();
    const keys = new Set(
      existing.map((r) => r.recordKey ?? `registry:${r._id}`),
    );
    const identities = new Set(
      existing.map((r) => `${r.name.toLocaleLowerCase()}|${r.siteUrl}`),
    );
    let added = 0,
      skipped = 0;
    for (const [index, d] of cleaned.entries()) {
      const identity = `${d.name.toLocaleLowerCase()}|${d.siteUrl}`;
      if ((d.recordKey && keys.has(d.recordKey)) || identities.has(identity)) {
        skipped++;
        continue;
      }
      const now = Date.now();
      await ctx.db.insert("agencyWebsiteRegistry", {
        ...d,
        archived: records[index].archived ?? false,
        revision: 1,
        createdAt: now,
        updatedAt: now,
      });
      if (d.recordKey) keys.add(d.recordKey);
      identities.add(identity);
      added++;
    }
    return { added, skipped };
  },
});
export const addFromPortfolio = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    const projects = await ctx.db.query("agencyProjects").collect();
    const records = await ctx.db.query("agencyWebsiteRegistry").collect();
    const linked = new Set(
      records.map((r) => r.linkedProjectId).filter(Boolean),
    );
    const identities = new Set(records.map((r) => r.name.toLocaleLowerCase()));
    let added = 0;
    for (const p of projects) {
      if (linked.has(p._id) || identities.has(p.titleAr.toLocaleLowerCase()))
        continue;
      let siteUrl = "";
      try {
        siteUrl = cleanUrl(p.liveUrl ?? "");
      } catch {
        /* Keep unverified URLs out of the register. */
      }
      const now = Date.now();
      await ctx.db.insert("agencyWebsiteRegistry", {
        ...emptyRegistryInput(),
        name: p.titleAr,
        siteUrl,
        domain: siteUrl ? new URL(siteUrl).hostname : "",
        linkedProjectId: p._id,
        notes: "أضيف من معرض الأعمال. راجع حسابات الخدمات والاستضافة والتجديد.",
        archived: false,
        revision: 1,
        createdAt: now,
        updatedAt: now,
      });
      identities.add(p.titleAr.toLocaleLowerCase());
      added++;
    }
    return { added };
  },
});
