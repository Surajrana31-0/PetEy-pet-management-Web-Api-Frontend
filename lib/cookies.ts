import { cookies } from 'next/headers';

export async function getAuthCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
}

export async function setAuthCookiesFromResponse(setCookieHeaders: string[]): Promise<void> {
  const cookieStore = await cookies();
  for (const header of setCookieHeaders) {
    const [pair, ...rest] = header.split(';');
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) continue;
    const name = pair.slice(0, eqIdx).trim();
    const value = pair.slice(eqIdx + 1).trim();
    const attrs = rest.join('; ');
    const httpOnly = /httponly/i.test(attrs);
    const secure = /secure/i.test(attrs);
    const sameSiteMatch = /samesite=([^;]+)/i.exec(attrs);
    const sameSite = sameSiteMatch?.[1]?.trim().toLowerCase() as
      | 'strict'
      | 'lax'
      | 'none'
      | undefined;
    const maxAgeMatch = /max-age=([^;]+)/i.exec(attrs);
    const maxAge = maxAgeMatch ? Number(maxAgeMatch[1]) : undefined;
    const pathMatch = /path=([^;]+)/i.exec(attrs);
    const path = pathMatch?.[1]?.trim() || '/';

    cookieStore.set(name, value, {
      httpOnly,
      secure,
      sameSite: sameSite || 'strict',
      maxAge,
      path,
    });
  }
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  ['accessToken', 'refreshToken'].forEach((name) => {
    cookieStore.set(name, '', { path: '/', maxAge: 0 });
  });
}
