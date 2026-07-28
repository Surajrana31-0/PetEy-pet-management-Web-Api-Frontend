'use server';

import { redirect } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { clearAuthCookies } from '@/lib/cookies';
import { dashboardPathForRole } from '@/lib/auth/roles';
import type { UserRole } from '@/lib/types';

export interface AuthFormState {
  error: string | null;
  success: boolean;
}

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const fullName = formData.get('fullName')?.toString().trim();
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();

  if (!fullName || !email || !password) {
    return { error: 'All fields are required.', success: false };
  }

  const res = await authApi.register({ fullName, email, password });
  if (res.error) return { error: res.error, success: false };

  redirect('/login?registered=1');
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();
  const redirectTarget = formData.get('redirect')?.toString();

  if (!email || !password) {
    return { error: 'Email and password are required.', success: false };
  }

  const res = await authApi.login({ email, password });
  if (res.error || !res.data) {
    return { error: res.error || 'Login failed.', success: false };
  }

  const role = (res.data.user?.role as UserRole) || 'USER';

  if (redirectTarget && redirectTarget.startsWith('/') && !redirectTarget.startsWith('//')) {
    redirect(redirectTarget);
  }

  redirect(dashboardPathForRole(role));
}

export async function logoutAction(): Promise<void> {
  await authApi.logout();
  await clearAuthCookies();
  redirect('/login');
}
