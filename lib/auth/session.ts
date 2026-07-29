import { cookies } from 'next/headers';
import { authApi } from '@/lib/api/auth';
import { setCachedToken, setServerCookieHeader } from '@/lib/api/axios-instance';
import type { IUser } from '@/lib/types/auth';

export async function getCurrentUser(): Promise<IUser | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (accessToken) {
      setCachedToken(accessToken);
      setServerCookieHeader(null);
    } else {
      const allCookies = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join('; ');
      if (!allCookies) return null;
      await setServerCookieHeader(allCookies);
    }

    const res = await authApi.me();
    if (res.success && res.data) return res.data;
    return null;
  } catch {
    return null;
  }
}
