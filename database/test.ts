import { mutation } from "./_generated/server";

export const seedSampleData = mutation({
    args: {},
    handler: async (ctx) => {
        // Dummy users
        const userIdUno = await ctx.db.insert("users", {
            clerkId: "user_test_mock_123",
            name: "Alex Rivera",
            firstName: "Alex",
            lastName: "Rivera",
            email: "alex@example.com",
            avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        });

        const userIdDos = await ctx.db.insert("users", {
            clerkId: "user_test_mock_456",
            name: "John Doe",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        });

        // Items constant for wishlists
        const items = [
            {
                id: "item_1",
                title: "Noise-Cancelling Headphones",
                price: 199.99,
                priority: true,
                url: "https://example.com/headphones",
                itemClaimedBy: userIdDos,
            },
            {
                id: "item_2",
                title: "Insulated Water Bottle",
                price: 35.0,
                priority: false,
                url: "https://example.com/bottle",
            },
        ];

        // Dummy Wishlists
        const wishlistIdAlex = await ctx.db.insert("wishlists", {
            ownerId: userIdUno,
            title: "Holiday Wishlist",
            description: "A few things I've been eyeing lately!",
            keepPurchasesSecret: true,
            items,
            isArchived: false,
        });

        const wishlistIdJohn = await ctx.db.insert("wishlists", {
            ownerId: userIdDos,
            title: "Holiday Wishlist",
            description: "A few things I've been eyeing lately!",
            keepPurchasesSecret: true,
            items,
            isArchived: false,
        });

        // Update users with shared lists
        await ctx.db.patch(userIdUno, {
            sharedLists: [wishlistIdJohn],//John shared his list with Alex
        });

        await ctx.db.patch(userIdDos, {
            sharedLists: [wishlistIdAlex],//Alex shared his list with John
        });

        // Add corresponding records in shared_wishlists table
        await ctx.db.insert("shared_wishlists", {
            wishlistId: wishlistIdJohn,
            userId: userIdUno,
            status: "accepted",
        });

        await ctx.db.insert("shared_wishlists", {
            wishlistId: wishlistIdAlex,
            userId: userIdDos,
            status: "accepted",
        });

        return {
            success: true,
            created: { userIdUno, userIdDos, wishlistIdAlex, wishlistIdJohn, items },
        };
    },
});
