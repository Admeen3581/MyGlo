import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query: getFeed
 * Fetches all wishlists (public feed) with owner info and item counts.
 */
export const getFeed = query({
    args: {},
    handler: async (ctx) => {
        const wishlists = await ctx.db
            .query("wishlists")
            .collect();

        return await Promise.all(
            wishlists.map(async (list) => {
                const owner = await ctx.db.get(list.ownerId);

                return {
                    ...list,
                    ownerName: owner?.name ?? "Anonymous",
                    ownerAvatar: owner?.avatarUrl,
                    itemCount: list.items?.length ?? 0,
                };
            })
        );
    },
});

/**
 * Query: getMyWishlists
 * Fetches wishlists owned by a specific user (by Clerk ID).
 */
export const getMyWishlists = query({
    args: { clerkId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.clerkId) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId!))
            .first();

        if (!user) {
            return [];
        }

        const wishlists = await ctx.db
            .query("wishlists")
            .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
            .collect();

        return wishlists.map((list) => ({
            ...list,
            itemCount: list.items?.length ?? 0,
        }));
    },
});

/**
 * Query: getSharedWishlists
 * Fetches wishlists shared with a specific user (via shared_wishlists index and user.sharedLists array).
 */
export const getSharedWishlists = query({
    args: { clerkId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.clerkId) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId!))
            .first();

        if (!user) {
            return [];
        }

        const sharedRecords = await ctx.db
            .query("shared_wishlists")
            .withIndex("by_user_and_status", (q) =>
                q.eq("userId", user._id).eq("status", "accepted")
            )
            .collect();

        const sharedRecordIds = sharedRecords.map((r) => r.wishlistId);
        const legacyIds = user.sharedLists ?? [];

        const allWishlistIds = Array.from(new Set([...sharedRecordIds, ...legacyIds]));

        if (allWishlistIds.length === 0) {
            return [];
        }

        const sharedLists = await Promise.all(
            allWishlistIds.map(async (wishlistId) => {
                const list = await ctx.db.get(wishlistId);
                if (!list) return null;

                const owner = await ctx.db.get(list.ownerId);

                return {
                    ...list,
                    ownerName: owner?.name ?? owner?.firstName ?? "Friend",
                    ownerAvatar: owner?.avatarUrl ?? owner?.avatar,
                    itemCount: list.items?.length ?? 0,
                };
            })
        );

        return sharedLists.filter((item): item is NonNullable<typeof item> => item !== null);
    },
});

/**
 * Query: getPendingSharedLists
 * Fetches wishlists that are currently pending invitation for a specific user (via shared_wishlists index and user.pendingSharedLists array).
 */
export const getPendingSharedLists = query({
    args: { clerkId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.clerkId) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId!))
            .first();

        if (!user) {
            return [];
        }

        const pendingRecords = await ctx.db
            .query("shared_wishlists")
            .withIndex("by_user_and_status", (q) =>
                q.eq("userId", user._id).eq("status", "pending")
            )
            .collect();

        const pendingRecordIds = pendingRecords.map((r) => r.wishlistId);
        const legacyIds = user.pendingSharedLists ?? [];

        const allWishlistIds = Array.from(new Set([...pendingRecordIds, ...legacyIds]));

        if (allWishlistIds.length === 0) {
            return [];
        }

        const pendingLists = await Promise.all(
            allWishlistIds.map(async (wishlistId) => {
                const list = await ctx.db.get(wishlistId);
                if (!list) return null;

                const owner = await ctx.db.get(list.ownerId);

                return {
                    ...list,
                    ownerName: owner?.name ?? owner?.firstName ?? "Friend",
                    ownerAvatar: owner?.avatarUrl ?? owner?.avatar,
                    itemCount: list.items?.length ?? 0,
                };
            })
        );

        return pendingLists.filter((item): item is NonNullable<typeof item> => item !== null);
    },
});

/**
 * Mutation: createWishlist / handleCreateNewList
 * Creates a new wishlist record in the database.
 */
export const createWishlist = mutation({
    args: {
        clerkId: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        keepPurchasesSecret: v.boolean(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        const newWishlistId = await ctx.db.insert("wishlists", {
            ownerId: user._id,
            title: args.title.trim(),
            description: args.description?.trim(),
            keepPurchasesSecret: args.keepPurchasesSecret,
            items: [],
            isArchived: false,
        });

        return newWishlistId;
    },
});

/**
 * Mutation: renameWishlist
 * Updates the title of an existing wishlist document.
 */
export const renameWishlist = mutation({
    args: {
        wishlistId: v.id("wishlists"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const wishlist = await ctx.db.get(args.wishlistId);

        if (!wishlist) {
            throw new Error("Wishlist not found");
        }

        await ctx.db.patch(args.wishlistId, {
            title: args.title.trim(),
        });

        return true;
    },
});

/**
 * Mutation: deleteWishlist
 * 1. Uses the indexed shared_wishlists table (by_wishlist index) to immediately find ONLY the users this list was shared with.
 * 2. Removes the wishlist ID from those specific users' sharedLists and pendingSharedLists arrays and deletes the share records.
 * 3. Deletes the wishlist document from database.
 * Time Complexity: O(K) where K is the number of users this list was shared with (instead of O(N) over all system users).
 */
export const deleteWishlist = mutation({
    args: {
        wishlistId: v.id("wishlists"),
    },
    handler: async (ctx, args) => {
        const wishlist = await ctx.db.get(args.wishlistId);

        if (!wishlist) {
            return false;
        }

        // 1. Efficiently find ONLY the users this specific wishlist was shared with using by_wishlist index
        const shares = await ctx.db
            .query("shared_wishlists")
            .withIndex("by_wishlist", (q) => q.eq("wishlistId", args.wishlistId))
            .collect();

        for (const share of shares) {
            const targetUser = await ctx.db.get(share.userId);
            if (targetUser) {
                let shouldPatch = false;
                let updatedShared = targetUser.sharedLists;
                let updatedPending = targetUser.pendingSharedLists;

                if (targetUser.sharedLists && targetUser.sharedLists.includes(args.wishlistId)) {
                    updatedShared = targetUser.sharedLists.filter((id) => id !== args.wishlistId);
                    shouldPatch = true;
                }

                if (targetUser.pendingSharedLists && targetUser.pendingSharedLists.includes(args.wishlistId)) {
                    updatedPending = targetUser.pendingSharedLists.filter((id) => id !== args.wishlistId);
                    shouldPatch = true;
                }

                if (shouldPatch) {
                    await ctx.db.patch(targetUser._id, {
                        sharedLists: updatedShared,
                        pendingSharedLists: updatedPending,
                    });
                }
            }
            await ctx.db.delete(share._id);
        }

        // 2. Delete the wishlist document from database
        await ctx.db.delete(args.wishlistId);
        return true;
    },
});
