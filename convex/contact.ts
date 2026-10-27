import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./adminAuth";
import { consumeLimit, hasCapacity, hash } from "./security";

export const submit = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    service: v.optional(v.string()),
    message: v.string(),
    budget: v.optional(v.string()),
    timeline: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.website) return { ok: true as const };
    const name = args.name.trim();
    const message = args.message.trim();
    const phone = args.phone.replace(/[^\d+]/g, "");
    const digits = phone.replace(/\D/g, "");
    if (
      name.length < 2 ||
      name.length > 100 ||
      message.length < 10 ||
      message.length > 5000 ||
      args.phone.length > 32 ||
      !/^\+?[\d\s()-]+$/.test(args.phone) ||
      digits.length < 8 ||
      digits.length > 15
    ) {
      return {
        ok: false as const,
        error: "راجع الاسم ورقم الجوال وتفاصيل المشروع ثم أعد الإرسال.",
      };
    }
    if (
      args.email &&
      (args.email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email))
    ) {
      return { ok: false as const, error: "اكتب بريدًا إلكترونيًا صحيحًا." };
    }
    if (
      [args.service, args.budget, args.timeline].some(
        (value) => value && value.length > 150,
      )
    ) {
      return {
        ok: false as const,
        error: "اختصر الخدمة والميزانية والموعد المطلوب.",
      };
    }
    const phoneKey = await hash(digits);
    // Check the shared cap before creating a new phone bucket, so rotating phone
    // numbers cannot grow the limiter table after the shared window is full.
    if (!(await hasCapacity(ctx, "contact:global", 100))) {
      return {
        ok: false as const,
        error: "وصلت طلبات كثيرة. حاول لاحقًا أو تواصل معنا عبر واتساب.",
      };
    }
    if (
      !(await consumeLimit(ctx, `contact:${phoneKey}`, 3, 60 * 60_000)) ||
      !(await consumeLimit(ctx, "contact:global", 100, 60 * 60_000))
    ) {
      return {
        ok: false as const,
        error: "وصلت طلبات متكررة. حاول لاحقًا أو تواصل معنا عبر واتساب.",
      };
    }
    await ctx.db.insert("agencyContactRequests", {
      name,
      phone,
      message,
      email: args.email?.trim() || undefined,
      service: args.service?.trim() || undefined,
      budget: args.budget?.trim() || undefined,
      timeline: args.timeline?.trim() || undefined,
      status: "new",
      createdAt: Date.now(),
    });
    return { ok: true as const };
  },
});

export const list = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    return await ctx.db
      .query("agencyContactRequests")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    token: v.string(),
    id: v.id("agencyContactRequests"),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("closed"),
    ),
  },
  handler: async (ctx, { token, id, status }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, { status });
  },
});
