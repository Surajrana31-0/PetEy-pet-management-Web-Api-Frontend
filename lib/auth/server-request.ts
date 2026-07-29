import { cookies } from 'next/headers';
import { setCachedToken, clearCachedToken, setServerCookieHeader } from '@/lib/api/axios-instance';

export async function prepareServerRequest(): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (accessToken) {
    setCachedToken(accessToken);
    setServerCookieHeader(null);
  } else {
    clearCachedToken();
    const allCookies = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');
    await setServerCookieHeader(allCookies || null);
  }
}
