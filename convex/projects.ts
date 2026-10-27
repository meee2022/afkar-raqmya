import {
  mutation,
  query,
  type QueryCtx,
  type MutationCtx,
} from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { requireAdmin } from "./adminAuth";
import { webUrl } from "./security";
import { catalogMatch } from "../shared/projects";
import type { Id } from "./_generated/dataModel";

async function checkMedia(
  ctx: MutationCtx,
  id: Id<"_storage"> | undefined,
  type: "image" | "video",
) {
  if (!id) return;
  const file = await ctx.db.system.get("_storage", id);
  const allowed =
    type === "image"
      ? ["image/jpeg", "image/png", "image/webp", "image/avif"]
      : ["video/mp4", "video/webm"];
  if (
    !file ||
    !allowed.includes(file.contentType ?? "") ||
    file.size > (type === "image" ? 10 : 50) * 1024 * 1024
  )
    throw new Error("نوع الملف أو حجمه غير مسموح");
}

async function present(ctx: QueryCtx, p: Doc<"agencyProjects">) {
  const fallback = catalogMatch(p);
  return {
    ...p,
    slug: p.slug ?? fallback?.slug ?? p._id,
    phone: p.phone ?? fallback?.phone ?? false,
    featured: p.featured ?? fallback?.featured ?? false,
    imageUrl: p.imageStorageId
      ? await ctx.storage.getUrl(p.imageStorageId)
      : (p.previewImage ?? fallback?.imageUrl ?? null),
    videoUrl: p.videoStorageId
      ? await ctx.storage.getUrl(p.videoStorageId)
      : (p.previewVideo ?? fallback?.videoUrl ?? null),
  };
}
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("agencyProjects")
      .withIndex("by_sortOrder")
      .collect();
    const published = await Promise.all(
      rows.filter((p) => p.isActive).map((p) => present(ctx, p)),
    );
    return published.filter((p) => p.imageUrl || p.videoUrl);
  },
});
export const listAll = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    const rows = await ctx.db
      .query("agencyProjects")
      .withIndex("by_sortOrder")
      .collect();
    return Promise.all(rows.map((p) => present(ctx, p)));
  },
});
export const generateUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    return ctx.storage.generateUploadUrl();
  },
});
const fields = {
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
};
export const create = mutation({
  args: { token: v.string(), ...fields, sortOrder: v.number() },
  handler: async (ctx, { token, ...data }) => {
    await requireAdmin(ctx, token);
    await checkMedia(ctx, data.imageStorageId, "image");
    await checkMedia(ctx, data.videoStorageId, "video");
    if (
      !data.titleAr.trim() ||
      data.titleAr.length > 200 ||
      data.descriptionAr.length > 5000
    )
      throw new Error("راجع عنوان المشروع ووصفه");
    return ctx.db.insert("agencyProjects", {
      ...data,
      titleAr: data.titleAr.trim(),
      liveUrl: webUrl(data.liveUrl),
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
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, { token, id, ...patch }) => {
    await requireAdmin(ctx, token);
    await checkMedia(ctx, patch.imageStorageId, "image");
    await checkMedia(ctx, patch.videoStorageId, "video");
    if (
      patch.titleAr !== undefined &&
      (!patch.titleAr.trim() || patch.titleAr.length > 200)
    )
      throw new Error("عنوان المشروع مطلوب وبحد أقصى 200 حرف");
    if (patch.descriptionAr && patch.descriptionAr.length > 5000)
      throw new Error("وصف المشروع طويل جدًا");
    if (patch.liveUrl !== undefined) patch.liveUrl = webUrl(patch.liveUrl);
    await ctx.db.patch(id, patch);
  },
});
// Recoverable archive; uploaded files are retained.
export const remove = mutation({
  args: { token: v.string(), id: v.id("agencyProjects") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, { isActive: false });
  },
});
