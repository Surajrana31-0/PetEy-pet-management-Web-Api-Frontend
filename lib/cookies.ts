import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';

const AUTH_COOKIE_NAMES = ['accessToken', 'refreshToken'] as const;

type AuthCookieName = (typeof AUTH_COOKIE_NAMES)[number];

function isAuthCookieName(name: string): name is AuthCookieName {
  return AUTH_COOKIE_NAMES.includes(name as AuthCookieName);
}

export async function setAuthCookiesFromResponse(response: AxiosResponse): Promise<void> {
  const setCookieHeader = response.headers['set-cookie'];
  if (!setCookieHeader) {
    return;
  }

  const cookieStore = await cookies();
  const cookieStrings = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

  for (const cookieString of cookieStrings) {
    const [nameValue, ...attributeParts] = cookieString.split(';');
    const equalsIndex = nameValue.indexOf('=');
    if (equalsIndex === -1) {
      continue;
    }

    const name = nameValue.slice(0, equalsIndex).trim();
    const value = nameValue.slice(equalsIndex + 1).trim();

    if (!isAuthCookieName(name)) {
      continue;
    }

    const options: Parameters<typeof cookieStore.set>[2] = {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    };

    for (const part of attributeParts) {
      const [rawKey, rawValue] = part.trim().split('=');
      const key = rawKey.toLowerCase();

      if (key === 'max-age' && rawValue) {
        options.maxAge = Number.parseInt(rawValue, 10);
      }
    }

    cookieStore.set(name, value, options);
  }
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
