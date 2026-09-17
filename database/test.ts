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

        // 2. Insert a wishlist for that user
        const wishlistId = await ctx.db.insert("wishlists", {
            ownerId: userId,
            title: "Holiday Wishlist",
            description: "A few things I've been eyeing lately!",
            visibility: "public",
            keepPurchasesSecret: true,
        });

        // 3. Insert items into the wishlist
        const item1 = await ctx.db.insert("items", {
            wishlistId,
            title: "Noise-Cancelling Headphones",
            price: 199.99,
            priority: "high",
            url: "https://example.com/headphones",
        });

        const item2 = await ctx.db.insert("items", {
            wishlistId,
            title: "Insulated Water Bottle",
            price: 35.0,
            priority: "medium",
        });

        return {
            success: true,
            created: { userId, wishlistId, items: [item1, item2] },
        };
    },
});