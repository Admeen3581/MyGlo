import { query } from "./_generated/server";
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
