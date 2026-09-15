import { tokenCache } from '@clerk/expo/token-cache';

export { tokenCache };

export function getClerkErrorMessage(err: unknown, fallbackMessage: string): string {
  if (!err) return fallbackMessage;
  const anyErr = err as any;
  const clerkMsg = anyErr?.errors?.[0]?.longMessage || anyErr?.errors?.[0]?.message || anyErr?.message;
  return clerkMsg || fallbackMessage;
}
