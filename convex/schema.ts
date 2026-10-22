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
    previewImage: v.optional(v.string()),
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

  // Invoices and quotations created from the admin panel
  agencyDocuments: defineTable({
    kind: v.union(v.literal("invoice"), v.literal("quote")),
    number: v.string(),
    year: v.number(),
    seq: v.number(),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("accepted"), v.literal("paid"), v.literal("cancelled")),
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
    sourceQuoteId: v.optional(v.id("agencyDocuments")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_kind_year_seq", ["kind", "year", "seq"])
    .index("by_sourceQuote", ["sourceQuoteId"]),

  // Company details printed on invoices (single row)
  agencyBillingInfo: defineTable({
    crNumber: v.optional(v.string()),
    bankName: v.optional(v.string()),
    accountName: v.optional(v.string()),
    iban: v.optional(v.string()),
    paymentTerms: v.optional(v.string()),
    quoteValidityDays: v.optional(v.number()),
    updatedAt: v.number(),
  }),

  agencyAdminSessions: defineTable({
    tokenHash: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_tokenHash", ["tokenHash"]),
});
