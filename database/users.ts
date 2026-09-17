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
        creationTime: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        console.log("[Convex database/users.ts] createUser called with args:", args);

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
        const creationTime = args.creationTime ?? Date.now();

        if (existingUser) {
            console.log("[Convex database/users.ts] Updating existing user:", existingUser._id);
            await ctx.db.patch(existingUser._id, {
                firstName: args.firstName,
                lastName: args.lastName,
                name: fullName,
                avatar: avatarImage,
                avatarUrl: avatarImage,
                email: args.email,
                creationTime,
            });
            return existingUser._id;
        }

        console.log("[Convex database/users.ts] Inserting new user for clerkId:", args.clerkId);
        const newUserId = await ctx.db.insert("users", {
            clerkId: args.clerkId,
            firstName: args.firstName,
            lastName: args.lastName,
            name: fullName,
            avatar: avatarImage,
            avatarUrl: avatarImage,
            email: args.email,
            creationTime,
        });

        console.log("[Convex database/users.ts] Successfully inserted new user with id:", newUserId);
        return newUserId;
    },
});

/**
 * Query: getUserByClerkId
 * Fetches user document by Clerk ID.
 */
export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();
    },
});
