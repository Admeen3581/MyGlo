import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query: getFriends
 * Fetches all friends for a user identified by Clerk ID.
 */
export const getFriends = query({
    args: { clerkId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.clerkId) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId!))
            .first();

        if (!user || !user.friends || user.friends.length === 0) {
            return [];
        }

        const friendDocs = await Promise.all(
            user.friends.map(async (friendId) => {
                const friend = await ctx.db.get(friendId);
                if (!friend) return null;

                const fullName =
                    friend.name ||
                    [friend.firstName, friend.lastName].filter(Boolean).join(" ") ||
                    "User";

                return {
                    _id: friend._id,
                    clerkId: friend.clerkId,
                    name: fullName,
                    firstName: friend.firstName,
                    lastName: friend.lastName,
                    avatarUrl: friend.avatarUrl || friend.avatar,
                    avatar: friend.avatar || friend.avatarUrl,
                    email: friend.email,
                };
            })
        );

        return friendDocs.filter((item): item is NonNullable<typeof item> => item !== null);
    },
});

/**
 * Query: getPendingFriendRequests
 * Fetches all users who have sent pending friend requests to the current user (by Clerk ID).
 */
export const getPendingFriendRequests = query({
    args: { clerkId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.clerkId) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId!))
            .first();

        if (!user || !user.pendingFriendRequests || user.pendingFriendRequests.length === 0) {
            return [];
        }

        const requesterDocs = await Promise.all(
            user.pendingFriendRequests.map(async (requesterId) => {
                const requester = await ctx.db.get(requesterId);
                if (!requester) return null;

                const fullName =
                    requester.name ||
                    [requester.firstName, requester.lastName].filter(Boolean).join(" ") ||
                    "User";

                return {
                    _id: requester._id,
                    clerkId: requester.clerkId,
                    name: fullName,
                    firstName: requester.firstName,
                    lastName: requester.lastName,
                    avatarUrl: requester.avatarUrl || requester.avatar,
                    avatar: requester.avatar || requester.avatarUrl,
                    email: requester.email,
                };
            })
        );

        return requesterDocs.filter((item): item is NonNullable<typeof item> => item !== null);
    },
});

/**
 * Query: getUsersForFriendInvite
 * Fetches all registered users (excluding current user) along with friend status flags.
 * If no other users are present in the database, returns sample discoverable users.
 */
export const getUsersForFriendInvite = query({
    args: { currentClerkId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const allUsers = await ctx.db.query("users").collect();

        const currentUser = args.currentClerkId
            ? await ctx.db
                .query("users")
                .withIndex("by_clerkId", (q) => q.eq("clerkId", args.currentClerkId!))
                .first()
            : null;

        const otherUsers = allUsers.filter(
            (u) => u.clerkId !== args.currentClerkId && u._id !== currentUser?._id
        );

        const currentFriends = currentUser?.friends ?? [];
        const currentPendingIncoming = currentUser?.pendingFriendRequests ?? [];
        const currentSent = currentUser?.sentFriendRequests ?? [];

        if (otherUsers.length > 0) {
            return otherUsers.map((targetUser) => {
                const isFriend = currentFriends.includes(targetUser._id);
                const isPendingIncoming = currentPendingIncoming.includes(targetUser._id);
                const targetPendingIncoming = targetUser.pendingFriendRequests ?? [];
                const isPendingOutgoing =
                    currentSent.includes(targetUser._id) || (currentUser ? targetPendingIncoming.includes(currentUser._id) : false);

                const fullName =
                    targetUser.name ||
                    [targetUser.firstName, targetUser.lastName].filter(Boolean).join(" ") ||
                    "User";

                return {
                    _id: targetUser._id,
                    clerkId: targetUser.clerkId,
                    name: fullName,
                    firstName: targetUser.firstName,
                    lastName: targetUser.lastName,
                    avatarUrl: targetUser.avatarUrl || targetUser.avatar,
                    avatar: targetUser.avatar || targetUser.avatarUrl,
                    email: targetUser.email,
                    isFriend,
                    isPendingIncoming,
                    isPendingOutgoing,
                };
            });
        }

        // Sample fallback users for testing and instant discoverability
        const sampleUsers = [
            {
                _id: "sample_user_alex" as any,
                clerkId: "user_sample_alex",
                name: "Alex Rivera",
                firstName: "Alex",
                lastName: "Rivera",
                avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
                email: "alex.rivera@example.com",
                isFriend: false,
                isPendingIncoming: false,
                isPendingOutgoing: false,
            },
            {
                _id: "sample_user_sarah" as any,
                clerkId: "user_sample_sarah",
                name: "Sarah Connor",
                firstName: "Sarah",
                lastName: "Connor",
                avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                email: "sarah.c@example.com",
                isFriend: false,
                isPendingIncoming: false,
                isPendingOutgoing: false,
            },
            {
                _id: "sample_user_john" as any,
                clerkId: "user_sample_john",
                name: "John Doe",
                firstName: "John",
                lastName: "Doe",
                avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
                avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
                email: "john.doe@example.com",
                isFriend: false,
                isPendingIncoming: false,
                isPendingOutgoing: false,
            },
            {
                _id: "sample_user_emma" as any,
                clerkId: "user_sample_emma",
                name: "Emma Watson",
                firstName: "Emma",
                lastName: "Watson",
                avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
                email: "emma.w@example.com",
                isFriend: false,
                isPendingIncoming: false,
                isPendingOutgoing: false,
            },
        ];

        return sampleUsers;
    },
});

/**
 * Mutation: sendFriendRequest
 * Sends a friend request to a target user. Auto-creates current or sample target user if needed.
 */
export const sendFriendRequest = mutation({
    args: {
        clerkId: v.string(),
        targetUserId: v.string(),
    },
    handler: async (ctx, args) => {
        let currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!currentUser) {
            const newId = await ctx.db.insert("users", {
                clerkId: args.clerkId,
                name: "User",
            });
            currentUser = (await ctx.db.get(newId))!;
        }

        let targetUser = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), args.targetUserId as any))
            .first();

        // If target was a sample user not yet in DB, insert sample user into DB
        if (!targetUser) {
            const sampleProfiles: Record<string, { name: string; email: string; avatarUrl: string }> = {
                sample_user_alex: { name: "Alex Rivera", email: "alex.rivera@example.com", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" },
                sample_user_sarah: { name: "Sarah Connor", email: "sarah.c@example.com", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
                sample_user_john: { name: "John Doe", email: "john.doe@example.com", avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61" },
                sample_user_emma: { name: "Emma Watson", email: "emma.w@example.com", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" },
            };

            const profile = sampleProfiles[args.targetUserId] || { name: "Sample User", email: "user@example.com", avatarUrl: "" };
            const newTargetId = await ctx.db.insert("users", {
                clerkId: `clerk_${args.targetUserId}`,
                name: profile.name,
                email: profile.email,
                avatarUrl: profile.avatarUrl,
            });
            targetUser = (await ctx.db.get(newTargetId))!;
        }

        const currentFriends = currentUser.friends ?? [];
        if (currentFriends.includes(targetUser._id)) {
            return { status: "already_friends" };
        }

        const targetPending = targetUser.pendingFriendRequests ?? [];
        const currentSent = currentUser.sentFriendRequests ?? [];

        // Check if target user already sent a request to current user
        const currentPending = currentUser.pendingFriendRequests ?? [];
        if (currentPending.includes(targetUser._id)) {
            const targetFriends = targetUser.friends ?? [];

            await ctx.db.patch(currentUser._id, {
                friends: [...currentFriends, targetUser._id],
                pendingFriendRequests: currentPending.filter((id) => id !== targetUser._id),
            });

            await ctx.db.patch(targetUser._id, {
                friends: [...targetFriends, currentUser._id],
                sentFriendRequests: (targetUser.sentFriendRequests ?? []).filter(
                    (id) => id !== currentUser._id
                ),
            });

            return { status: "accepted" };
        }

        if (!targetPending.includes(currentUser._id)) {
            await ctx.db.patch(targetUser._id, {
                pendingFriendRequests: [...targetPending, currentUser._id],
            });
        }

        if (!currentSent.includes(targetUser._id)) {
            await ctx.db.patch(currentUser._id, {
                sentFriendRequests: [...currentSent, targetUser._id],
            });
        }

        return { status: "sent" };
    },
});

/**
 * Mutation: acceptFriendRequest
 * Accepts a friend request from a requester.
 */
export const acceptFriendRequest = mutation({
    args: {
        clerkId: v.string(),
        requesterUserId: v.id("users"),
    },
    handler: async (ctx, args) => {
        let currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!currentUser) {
            const newId = await ctx.db.insert("users", { clerkId: args.clerkId, name: "User" });
            currentUser = (await ctx.db.get(newId))!;
        }

        const requesterUser = await ctx.db.get(args.requesterUserId);
        if (!requesterUser) {
            throw new Error("Requester user not found");
        }

        const currentFriends = currentUser.friends ?? [];
        const currentPending = currentUser.pendingFriendRequests ?? [];

        const updatedCurrentFriends = currentFriends.includes(args.requesterUserId)
            ? currentFriends
            : [...currentFriends, args.requesterUserId];

        const updatedCurrentPending = currentPending.filter((id) => id !== args.requesterUserId);

        await ctx.db.patch(currentUser._id, {
            friends: updatedCurrentFriends,
            pendingFriendRequests: updatedCurrentPending,
        });

        const requesterFriends = requesterUser.friends ?? [];
        const requesterSent = requesterUser.sentFriendRequests ?? [];

        const updatedRequesterFriends = requesterFriends.includes(currentUser._id)
            ? requesterFriends
            : [...requesterFriends, currentUser._id];

        const updatedRequesterSent = requesterSent.filter((id) => id !== currentUser._id);

        await ctx.db.patch(requesterUser._id, {
            friends: updatedRequesterFriends,
            sentFriendRequests: updatedRequesterSent,
        });

        return true;
    },
});

/**
 * Mutation: ignoreFriendRequest
 * Ignores a friend request from a requester.
 */
export const ignoreFriendRequest = mutation({
    args: {
        clerkId: v.string(),
        requesterUserId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!currentUser) {
            return true;
        }

        const currentPending = currentUser.pendingFriendRequests ?? [];
        const updatedCurrentPending = currentPending.filter((id) => id !== args.requesterUserId);

        await ctx.db.patch(currentUser._id, {
            pendingFriendRequests: updatedCurrentPending,
        });

        const requesterUser = await ctx.db.get(args.requesterUserId);
        if (requesterUser) {
            const requesterSent = requesterUser.sentFriendRequests ?? [];
            const updatedRequesterSent = requesterSent.filter((id) => id !== currentUser._id);
            await ctx.db.patch(requesterUser._id, {
                sentFriendRequests: updatedRequesterSent,
            });
        }

        return true;
    },
});

/**
 * Mutation: removeFriend
 * Removes a user from the current user's friends list (unfriend).
 */
export const removeFriend = mutation({
    args: {
        clerkId: v.string(),
        friendUserId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!currentUser) {
            return true;
        }

        const currentFriends = currentUser.friends ?? [];
        const updatedCurrentFriends = currentFriends.filter((id) => id !== args.friendUserId);

        await ctx.db.patch(currentUser._id, {
            friends: updatedCurrentFriends,
        });

        const friendUser = await ctx.db.get(args.friendUserId);
        if (friendUser) {
            const friendFriends = friendUser.friends ?? [];
            const updatedFriendFriends = friendFriends.filter((id) => id !== currentUser._id);
            await ctx.db.patch(friendUser._id, {
                friends: updatedFriendFriends,
            });
        }

        return true;
    },
});
