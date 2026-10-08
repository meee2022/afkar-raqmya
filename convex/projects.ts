import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./adminAuth";

export const list = query({
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("agencyProjects")
      .withIndex("by_sortOrder")
      .order("asc")
      .collect();

    return Promise.all(
      projects.filter((p) => p.isActive).map(async (p) => ({
        ...p,
        imageUrl: p.previewImage ?? (p.imageStorageId ? await ctx.storage.getUrl(p.imageStorageId) : null),
        videoUrl: p.videoStorageId ? await ctx.storage.getUrl(p.videoStorageId) : null,
      }))
    );
  },
});

export const generateUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    return ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    token: v.string(),
    titleAr: v.string(),
    descriptionAr: v.string(),
    category: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    videoStorageId: v.optional(v.id("_storage")),
    result: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    challenge: v.optional(v.string()),
    solution: v.optional(v.string()),
    outcome: v.optional(v.string()),
    role: v.optional(v.string()),
    duration: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    tags: v.array(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, { token, ...args }) => {
    await requireAdmin(ctx, token);
    return await ctx.db.insert("agencyProjects", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("agencyProjects"),
    titleAr: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    category: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    videoStorageId: v.optional(v.id("_storage")),
    result: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    challenge: v.optional(v.string()),
    solution: v.optional(v.string()),
    outcome: v.optional(v.string()),
    role: v.optional(v.string()),
    duration: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { token, id, ...patch }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("agencyProjects") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const project = await ctx.db.get(id);
    if (project?.imageStorageId) await ctx.storage.delete(project.imageStorageId);
    if (project?.videoStorageId) await ctx.storage.delete(project.videoStorageId);
    await ctx.db.delete(id);
  },
});
