/**
 * Client-side cookie helpers using document.cookie.
 * These are safe to import in 'use client' components.
 */

export function getClientTokenCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match ? match[1] : null;
}

export function clearClientAuthCookies(): void {
  if (typeof document === 'undefined') return;
  const cookies = ['accessToken', 'refreshToken', 'user_data'];
  cookies.forEach((name) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  });
}