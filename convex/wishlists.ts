// convex/wishlists.ts
import { query } from "./_generated/server";

export const getFeed = query({
    args: {},
    handler: async (ctx) => {
        // 1. Fetch wishlists marked as public
        const wishlists = await ctx.db
            .query("wishlists")
            .filter((q) => q.eq(q.field("visibility"), "public"))
            .collect();

        // 2. Attach owner info and item counts for the UI card
        return await Promise.all(
            wishlists.map(async (list) => {
                const owner = await ctx.db.get(list.ownerId);
                const items = await ctx.db
                    .query("items")
                    .withIndex("by_wishlist", (q) => q.eq("wishlistId", list._id))
                    .collect();

                return {
                    ...list,
                    ownerName: owner?.name ?? "Anonymous",
                    ownerAvatar: owner?.avatarUrl,
                    itemCount: items.length,
                };
            })
        );
    },
});