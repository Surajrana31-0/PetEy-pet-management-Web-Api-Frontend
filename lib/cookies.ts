'use server';

import { cookies } from 'next/headers';

export async function clearClientCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}