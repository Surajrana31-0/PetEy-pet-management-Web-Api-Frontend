import { cookies } from 'next/headers';

const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes (seconds)
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days (seconds)

function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

/**
 * Stores JWT tokens as HttpOnly cookies on the Next.js domain (localhost:3000).
 * Visible in DevTools → Application → Cookies (HttpOnly column = true).
 */
export async function setAuthCookies(accessToken: string, refreshToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', accessToken, getCookieOptions(ACCESS_TOKEN_MAX_AGE));
  cookieStore.set('refreshToken', refreshToken, getCookieOptions(REFRESH_TOKEN_MAX_AGE));
}

export async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');
}

export async function clearClientCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}
