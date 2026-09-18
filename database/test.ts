import { mutation } from "./_generated/server";

export const seedSampleData = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Insert a dummy user
        const userId = await ctx.db.insert("users", {
            clerkId: "user_test_mock_123",
            name: "Alex Rivera",
            email: "alex@example.com",
            avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        });

        // 2. Insert items directly inside the wishlist document
        const items = [
            {
                id: "item_1",
                title: "Noise-Cancelling Headphones",
                price: 199.99,
                priority: "high" as const,
                url: "https://example.com/headphones",
            },
            {
                id: "item_2",
                title: "Insulated Water Bottle",
                price: 35.0,
                priority: "medium" as const,
            },
        ];

        // 3. Insert a wishlist for that user
        const wishlistId = await ctx.db.insert("wishlists", {
            ownerId: userId,
            title: "Holiday Wishlist",
            description: "A few things I've been eyeing lately!",
            visibility: "public",
            keepPurchasesSecret: true,
            items,
        });

        return {
            success: true,
            created: { userId, wishlistId, items },
        };
    },
});
