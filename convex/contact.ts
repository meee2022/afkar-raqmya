import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    service: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agencyContactRequests", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("agencyContactRequests")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("agencyContactRequests"),
    status: v.union(v.literal("new"), v.literal("contacted"), v.literal("closed")),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});
