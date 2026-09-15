export type ThemeMode = 'light' | 'dark';

export interface UpdateThemeResponse {
  success: boolean;
  theme?: ThemeMode;
  error?: string;
}

/**
 * Saves the user's UI style preference to the backend API route.
 * Uses the Expo Router backend API endpoint `/api/user/theme`, which interacts
 * with Clerk Backend API.
 */
export async function saveUserThemeBackend(
  userId: string,
  theme: ThemeMode
): Promise<UpdateThemeResponse> {
  try {
    const response = await fetch('/api/user/theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, theme }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update theme preference' };
    }

    return { success: true, theme: data.theme };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { success: false, error: message };
  }
}
