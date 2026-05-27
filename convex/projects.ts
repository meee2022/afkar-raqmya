import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("agencyProjects")
      .withIndex("by_sortOrder")
      .order("asc")
      .collect();

    return Promise.all(
      projects.map(async (p) => ({
        ...p,
        imageUrl: p.imageStorageId ? await ctx.storage.getUrl(p.imageStorageId) : null,
        videoUrl: p.videoStorageId ? await ctx.storage.getUrl(p.videoStorageId) : null,
      }))
    );
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});

export const create = mutation({
  args: {
    titleAr: v.string(),
    descriptionAr: v.string(),
    category: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    videoStorageId: v.optional(v.id("_storage")),
    result: v.optional(v.string()),
    tags: v.array(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agencyProjects", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("agencyProjects"),
    titleAr: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    category: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    videoStorageId: v.optional(v.id("_storage")),
    result: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("agencyProjects") },
  handler: async (ctx, { id }) => {
    const project = await ctx.db.get(id);
    if (project?.imageStorageId) await ctx.storage.delete(project.imageStorageId);
    if (project?.videoStorageId) await ctx.storage.delete(project.videoStorageId);
    await ctx.db.delete(id);
  },
});
