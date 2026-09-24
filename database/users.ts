import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Mutation: createUser (or update existing user)
 * Creates or updates a user record in the database using details from Clerk.
 */
export const createUser = mutation({
    args: {
        clerkId: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        name: v.optional(v.string()),
        avatar: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        email: v.optional(v.string()),
    },
    handler: async (ctx, args) => {

        // Look up existing user by clerkId index
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        const fullName =
            args.name ||
            [args.firstName, args.lastName].filter(Boolean).join(" ") ||
            "";

        const avatarImage = args.avatar || args.avatarUrl;

        if (existingUser) {
            await ctx.db.patch(existingUser._id, {
                firstName: args.firstName,
                lastName: args.lastName,
                name: fullName,
                avatar: avatarImage,
                avatarUrl: avatarImage,
                email: args.email,
            });
            return existingUser._id;
        }

        const newUserId = await ctx.db.insert("users", {
            clerkId: args.clerkId,
            firstName: args.firstName,
            lastName: args.lastName,
            name: fullName,
            avatar: avatarImage,
            avatarUrl: avatarImage,
            email: args.email,
        });

        console.log("[Convex database/users.ts] Successfully inserted new user with id:", newUserId);
        return newUserId;
    },
});

/**
 * Mutation: shareWishlistWithUser
 * Adds a wishlist ID to the target user's pendingSharedLists array in the database.
 */
export const shareWishlistWithUser = mutation({
    args: {
        wishlistId: v.id("wishlists"),
        targetUserId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const targetUser = await ctx.db.get(args.targetUserId);
        if (!targetUser) {
            throw new Error("Target user not found");
        }

        const currentPending = targetUser.pendingSharedLists ?? [];
        const currentShared = targetUser.sharedLists ?? [];

        // Check if already shared or already pending
        if (!currentPending.includes(args.wishlistId) && !currentShared.includes(args.wishlistId)) {
            await ctx.db.patch(targetUser._id, {
                pendingSharedLists: [...currentPending, args.wishlistId],
            });
        }

        return true;
    },
});

/**
 * Mutation: acceptSharedList
 * Moves a wishlist ID from pendingSharedLists into sharedLists in the database.
 */
export const acceptSharedList = mutation({
    args: {
        clerkId: v.string(),
        wishlistId: v.id("wishlists"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        const currentShared = user.sharedLists ?? [];
        const currentPending = user.pendingSharedLists ?? [];

        const updatedShared = currentShared.includes(args.wishlistId)
            ? currentShared
            : [...currentShared, args.wishlistId];

        const updatedPending = currentPending.filter((id) => id !== args.wishlistId);

        await ctx.db.patch(user._id, {
            sharedLists: updatedShared,
            pendingSharedLists: updatedPending,
        });

        return true;
    },
});

/**
 * Mutation: ignoreSharedList
 * Removes a wishlist ID from pendingSharedLists without adding to sharedLists.
 */
export const ignoreSharedList = mutation({
    args: {
        clerkId: v.string(),
        wishlistId: v.id("wishlists"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        const currentPending = user.pendingSharedLists ?? [];
        const updatedPending = currentPending.filter((id) => id !== args.wishlistId);

        await ctx.db.patch(user._id, {
            pendingSharedLists: updatedPending,
        });

        return true;
    },
});

/**
 * Query: getAllUsers
 * Fetches all registered users in the database (optionally excluding the current user by clerkId).
 */
export const getAllUsers = query({
    args: { currentClerkId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const allUsers = await ctx.db.query("users").collect();
        if (args.currentClerkId) {
            return allUsers.filter((u) => u.clerkId !== args.currentClerkId);
        }
        return allUsers;
    },
});


/**
 * Query: checkEmailExists
 * Checks if a given email address exists in the Convex database.
 */
export const checkEmailExists = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const normalizedEmail = args.email.trim().toLowerCase();
        if (!normalizedEmail) return false;

        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
            .first();

        return !!existingUser;
    },
});
