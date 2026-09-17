import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Users synced from Clerk
    users: defineTable({
        clerkId: v.string(),
        email: v.optional(v.string()),
        name: v.string(),
        avatarUrl: v.optional(v.string()),
    })
        .index("by_clerkId", ["clerkId"]),

    // Core wishlists
    wishlists: defineTable({
        ownerId: v.id("users"),
        title: v.string(),
        description: v.optional(v.string()),
        eventDate: v.optional(v.string()), // e.g. "2026-12-25" or ISO string
        visibility: v.union(
            v.literal("public"),
            v.literal("friends_only"),
            v.literal("unlisted")
        ),
        // Secret Claim Toggle:
        // true = owner cannot see claims/purchases (surprise preserved)
        // false = owner can view purchase progress live
        keepPurchasesSecret: v.boolean(),
    })
        .index("by_owner", ["ownerId"]),

    // Items added to wishlists
    items: defineTable({
        wishlistId: v.id("wishlists"),
        title: v.string(),
        url: v.optional(v.string()),
        price: v.optional(v.number()),
        notes: v.optional(v.string()),
        priority: v.optional(
            v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
        ),
        // Stores Convex native file storage ID for user-uploaded photos
        imageStorageId: v.optional(v.id("_storage")),
        // Fallback or scraped external image link
        externalImageUrl: v.optional(v.string()),
    })
        .index("by_wishlist", ["wishlistId"]),

    // Separate claims table to isolate purchase state from item definitions
    claims: defineTable({
        itemId: v.id("items"),
        claimedById: v.id("users"),
        status: v.union(v.literal("reserved"), v.literal("purchased")),
        // Optional secret note between buyers (e.g. "Splitting this with Mark")
        buyerNotes: v.optional(v.string()),
        claimedAt: v.number(), // Unix timestamp (Date.now())
    })
        // Quickly check if an item is already claimed
        .index("by_item", ["itemId"])
        // Quickly list all items a user has pledged to buy across all lists
        .index("by_claimer", ["claimedById"]),
});