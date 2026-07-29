import { cookies } from 'next/headers';
import { authApi } from '@/lib/api/auth';
import type { IUser } from '@/lib/types/auth';

export async function getCurrentUser(): Promise<IUser | null> {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');
    if (!cookieHeader) return null;

    const res = await authApi.me();
    if (res.success && res.data) return res.data;
    return null;
  } catch {
    return null;
  }
}
