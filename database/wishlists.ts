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
 * Fetches wishlists shared with a specific user (via user.sharedLists array).
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

        if (!user || !user.sharedLists || user.sharedLists.length === 0) {
            return [];
        }

        const sharedLists = await Promise.all(
            user.sharedLists.map(async (wishlistId) => {
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
 * Fetches wishlists that are currently pending invitation for a specific user (from user.pendingSharedLists array).
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

        if (!user || !user.pendingSharedLists || user.pendingSharedLists.length === 0) {
            return [];
        }

        const pendingLists = await Promise.all(
            user.pendingSharedLists.map(async (wishlistId) => {
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
 * 1. Removes the wishlist ID from everyone's sharedLists and pendingSharedLists arrays in users table.
 * 2. Deletes the wishlist entry from the database.
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

        // 1. Remove from all users' sharedLists and pendingSharedLists arrays
        const users = await ctx.db.query("users").collect();
        for (const user of users) {
            let shouldPatch = false;
            let updatedShared = user.sharedLists;
            let updatedPending = user.pendingSharedLists;

            if (user.sharedLists && user.sharedLists.includes(args.wishlistId)) {
                updatedShared = user.sharedLists.filter((id) => id !== args.wishlistId);
                shouldPatch = true;
            }

            if (user.pendingSharedLists && user.pendingSharedLists.includes(args.wishlistId)) {
                updatedPending = user.pendingSharedLists.filter((id) => id !== args.wishlistId);
                shouldPatch = true;
            }

            if (shouldPatch) {
                await ctx.db.patch(user._id, {
                    sharedLists: updatedShared,
                    pendingSharedLists: updatedPending,
                });
            }
        }

        // 2. Delete the wishlist document from database
        await ctx.db.delete(args.wishlistId);
        return true;
    },
});
