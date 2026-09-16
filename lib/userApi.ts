export interface UpdateProfileParams {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  error?: string;
}

/**
 * Saves the user's first and last name to the backend API route.
 * Uses the Expo Router backend API endpoint `/api/user/profile`, which interacts
 * with Clerk Backend API via `clerkClient.users.updateUser(...)`.
 */
export async function saveUserProfileBackend(
  params: UpdateProfileParams
): Promise<UpdateProfileResponse> {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update user profile' };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { success: false, error: message };
  }
}
