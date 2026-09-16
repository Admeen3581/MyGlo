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
    image?: string | null;
    unsafeMetadata?: Record<string, any>;
}

//secret
const secretKey = process.env.CLERK_SECRET_KEY;

/**
 * Uploads a user profile image (base64 data URI, file URI, or image URL) to Clerk's profile_image REST endpoint.
 */
export async function uploadUserProfileImage(userId: string, image: string): Promise<void> {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
        console.warn('[clerkClient] Cannot upload profile image: CLERK_SECRET_KEY environment variable is not defined');
        return;
    }

    try {
        const formData = new FormData();

        if (image.startsWith('data:')) {
            const matches = image.match(/^data:([^;]+);base64,(.+)$/);
            if (matches) {
                const mimeType = matches[1] || 'image/jpeg';
                const base64Data = matches[2];
                const binaryString = atob(base64Data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: mimeType });
                formData.append('file', blob, 'avatar.jpg');
            } else {
                formData.append('file_url', image);
            }
        } else if (image.startsWith('file:')) {
            const res = await fetch(image);
            const blob = await res.blob();
            formData.append('file', blob, 'avatar.jpg');
        } else {
            formData.append('file_url', image);
        }

        const imgResponse = await fetch(`https://api.clerk.com/v1/users/${userId}/profile_image`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
            body: formData,
        });

        if (!imgResponse.ok) {
            const imgData = await imgResponse.json().catch(() => ({}));
            console.warn('[clerkClient] Profile image upload returned status:', imgResponse.status, imgData);
        }
    } catch (imgErr) {
        console.warn('[clerkClient] Failed to upload profile image:', imgErr);
    }
}

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

            // 1. If image is provided, upload via helper function
            if (params.image) {
                await uploadUserProfileImage(userId, params.image);
            }

            // 2. Prepare body for PATCH https://api.clerk.com/v1/users/${userId}
            const body: Record<string, any> = {};
            if (params.firstName !== undefined) body.first_name = params.firstName;
            if (params.lastName !== undefined) body.last_name = params.lastName;
            if (params.unsafeMetadata !== undefined || params.image !== undefined) {
                body.unsafe_metadata = {
                    ...(params.unsafeMetadata || {}),
                    ...(params.image ? { avatar_url: params.image } : {}),
                };
            }

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
