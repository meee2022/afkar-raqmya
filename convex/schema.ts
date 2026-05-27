import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  agencyServices: defineTable({
    titleAr: v.string(),
    descriptionAr: v.string(),
    icon: v.string(),
    sortOrder: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_sortOrder", ["sortOrder"])
    .index("by_active", ["isActive"]),

  agencyProjects: defineTable({
    titleAr: v.string(),
    descriptionAr: v.string(),
    category: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    videoStorageId: v.optional(v.id("_storage")),
    result: v.optional(v.string()),
    tags: v.array(v.string()),
    sortOrder: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_sortOrder", ["sortOrder"])
    .index("by_active", ["isActive"]),

  agencyPackages: defineTable({
    nameAr: v.string(),
    descriptionAr: v.optional(v.string()),
    price: v.number(),
    currency: v.string(),
    features: v.array(v.string()),
    isFeatured: v.optional(v.boolean()),
    sortOrder: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_sortOrder", ["sortOrder"])
    .index("by_active", ["isActive"]),

  agencyTestimonials: defineTable({
    clientName: v.string(),
    clientTitle: v.optional(v.string()),
    contentAr: v.string(),
    rating: v.optional(v.number()),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_active", ["isActive"]),

  agencyContactRequests: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    service: v.optional(v.string()),
    message: v.string(),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("closed")
    ),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  agencySiteSettings: defineTable({
    phone: v.string(),
    whatsapp: v.string(),
    email: v.optional(v.string()),
    instagramUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    updatedAt: v.number(),
  }),
});
