import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./adminAuth";
import { webUrl } from "./security";

export const get = query({
  handler: async (ctx) => {
    const rows = await ctx.db.query("agencySiteSettings").collect();
    const row = rows[0];
    if (!row) return null;
    return {
      ...row,
      email:
        row.email && !/afkar|fikra/i.test(row.email) ? row.email : undefined,
      instagramUrl:
        row.instagramUrl && !/afkar|fikra/i.test(row.instagramUrl)
          ? row.instagramUrl
          : "https://www.instagram.com/athartechdesign/",
    };
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
    if (
      args.phone.replace(/\D/g, "").length < 8 ||
      args.whatsapp.replace(/\D/g, "").length < 8
    )
      throw new Error("راجع رقم الهاتف ورقم واتساب");
    if (args.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email))
      throw new Error("راجع البريد الإلكتروني");
    args.instagramUrl = webUrl(args.instagramUrl);
    args.twitterUrl = webUrl(args.twitterUrl);
    args.email = args.email?.trim() || undefined;
    const rows = await ctx.db.query("agencySiteSettings").collect();
    if (rows[0]) {
      await ctx.db.patch(rows[0]._id, { ...args, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("agencySiteSettings", {
        ...args,
        updatedAt: Date.now(),
      });
    }
  },
});
