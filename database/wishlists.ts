import { query } from "./_generated/server";

export const getFeed = query({
    args: {},
    handler: async (ctx) => {
        // Fetch wishlists marked as public
        const wishlists = await ctx.db
            .query("wishlists")
            .collect();

        // Attach owner info and item counts for the UI card
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
