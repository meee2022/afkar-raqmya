import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./adminAuth";

export const get = query({
  handler: async (ctx) => {
    const rows = await ctx.db.query("agencySiteSettings").collect();
    return rows[0] ?? null;
  },
});

export const upsert = mutation({
  args: {
    token: v.string(),
    whatsapp: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    instagramUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
  },
  handler: async (ctx, { token, ...args }) => {
    await requireAdmin(ctx, token);
    const rows = await ctx.db.query("agencySiteSettings").collect();
    if (rows[0]) {
      await ctx.db.patch(rows[0]._id, { ...args, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("agencySiteSettings", { ...args, updatedAt: Date.now() });
    }
  },
});
