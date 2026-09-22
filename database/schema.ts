import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Users synced from Clerk
    users: defineTable({
        clerkId: v.string(),
        email: v.optional(v.string()),
        name: v.optional(v.string()),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        avatar: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        sharedLists: v.optional(
            v.array(
                v.id('wishlists')
            )
        ),
        pendingSharedLists: v.optional(
            v.array(
                v.id('wishlists')
            )
        )
    })
        .index("by_clerkId", ["clerkId"]),

    // Core wishlists
    wishlists: defineTable({
        ownerId: v.id("users"),
        title: v.string(),
        description: v.optional(v.string()),
        keepPurchasesSecret: v.boolean(),
        items: v.optional(
            v.array(
                v.object({
                    id: v.string(),
                    title: v.string(),
                    url: v.optional(v.string()),
                    price: v.number(),
                    notes: v.optional(v.string()),
                    priority: v.boolean(),
                    // Stores Convex native file storage ID for user-uploaded photos
                    imageStorageId: v.optional(v.id("_storage")),
                    // Fallback or scraped external image link
                    externalImageUrl: v.optional(v.string()),
                    itemClaimedBy: v.optional(v.id('users')),
                })
            )
        ),
        isArchived: v.boolean(),
    })
        .index("by_owner", ["ownerId"]),
});
