import { tokenCache } from '@clerk/expo/token-cache';

export { tokenCache };

export function getClerkErrorMessage(err: unknown, fallbackMessage: string): string {
    if (!err) return fallbackMessage;
    const anyErr = err as any;
    const clerkMsg = anyErr?.errors?.[0]?.longMessage || anyErr?.errors?.[0]?.message || anyErr?.message;
    return clerkMsg || fallbackMessage;
}

export interface ClerkUpdateUserParams {
    firstName?: string;
    lastName?: string;
    unsafeMetadata?: Record<string, any>;
}

//Secret Key
const secretKey = process.env.CLERK_SECRET_KEY;

export const clerkClient = {
    /**
     * API Handler Constant to resolve backend changes/additions/deletions.
     * @param updateUser: Changes content about the current logged-in user.
     * @param getUser: Returns current logged-in user details.
     */
    users: {
        updateUser: async (userId: string, params: ClerkUpdateUserParams) => {
            if (!secretKey) {
                throw new Error('CLERK_SECRET_KEY environment variable is not defined');
            }

            const body: Record<string, any> = {};
            if (params.firstName !== undefined) body.first_name = params.firstName;
            if (params.lastName !== undefined) body.last_name = params.lastName;
            if (params.unsafeMetadata !== undefined) body.unsafe_metadata = params.unsafeMetadata;

            //API Call to Clerk Servers -> PATCH UPDATES USER
            const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg =
                    data.errors?.[0]?.long_message ||
                    data.errors?.[0]?.message ||
                    'Failed to update user in Clerk backend';
                throw new Error(errorMsg);
            }

            return data;
        },
        getUser: async (userId: string) => {
            if (!secretKey) {
                throw new Error('CLERK_SECRET_KEY environment variable is not defined');
            }

            //API Call to Clerk Servers -> GET USER DETAILS
            const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg =
                    data.errors?.[0]?.long_message ||
                    data.errors?.[0]?.message ||
                    'Failed to fetch user from Clerk backend';
                throw new Error(errorMsg);
            }

            return data;
        },
    },
};
