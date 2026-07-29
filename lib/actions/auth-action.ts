'use server';

import { cookies } from 'next/headers';
import { authApi } from '@/lib/api/auth';
import { setCachedToken, clearCachedToken, setServerCookieHeader } from '@/lib/api/axios-instance';
import { clearAuthCookies } from '@/lib/cookies';
import { dashboardPathForRole } from '@/lib/auth/roles';
import { UserRole } from '@/lib/types';
import type { ActionResponse } from '@/lib/types/auth';
import { extractApiError } from '@/lib/api/errors';

async function prepareServerRequest(): Promise<void> {
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

async function setAuthCookies(accessToken?: string, refreshToken?: string): Promise<void> {
  if (!accessToken) return;
  const cookieStore = await cookies();
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });
  if (refreshToken) {
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}

export interface AuthFormState {
  error: string | null;
  success: boolean;
  redirectTo?: string;
}

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const fullName = formData.get('fullName')?.toString().trim();
  const username = formData.get('username')?.toString().trim();
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();

  if (!fullName || !username || !email || !password) {
    return { error: 'All fields are required.', success: false };
  }

  await prepareServerRequest();

  try {
    const res = await authApi.register({ fullName, username, email, password });
    if (!res.success) return { error: res.message || 'Registration failed.', success: false };

    if (res.data?.accessToken) {
      await setAuthCookies(res.data.accessToken, res.data.refreshToken);
    }

    return { error: null, success: true, redirectTo: '/login?registered=1' };
  } catch (err) {
    return { error: extractApiError(err, 'Registration failed.'), success: false };
  }
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

  await prepareServerRequest();

  let role: UserRole = UserRole.USER;
  try {
    const res = await authApi.login({ email, password });
    if (!res.success || !res.data) {
      return { error: res.message || 'Login failed.', success: false };
    }
    role = (res.data.user?.role as UserRole) || UserRole.USER;
    await setAuthCookies(res.data.accessToken, res.data.refreshToken);
  } catch (err) {
    return { error: extractApiError(err, 'Login failed.'), success: false };
  }

  const target =
    redirectTarget && redirectTarget.startsWith('/') && !redirectTarget.startsWith('//')
      ? redirectTarget
      : dashboardPathForRole(role);

  return { error: null, success: true, redirectTo: target };
}

export async function logoutAction(): Promise<void> {
  await prepareServerRequest();
  try { await authApi.logout(); } catch { /* ignore */ }
  clearCachedToken();
  await clearAuthCookies();
}

export async function loginUser(data: { email: string; password: string }): Promise<ActionResponse> {
  await prepareServerRequest();
  try {
    const res = await authApi.login({ email: data.email, password: data.password });
    if (!res.success || !res.data) return { success: false, message: res.message || 'Login failed.' };

    await setAuthCookies(res.data.accessToken, res.data.refreshToken);

    return {
      success: true,
      message: 'Login successful.',
      data: res.data,
    };
  } catch (err) {
    return { success: false, message: extractApiError(err, 'Login failed.') };
  }
}

export async function registerUser(data: {
  fullName: string;
  username: string;
  email: string;
  password: string;
}): Promise<ActionResponse> {
  await prepareServerRequest();
  try {
    const res = await authApi.register(data);
    if (!res.success) return { success: false, message: res.message || 'Registration failed.' };
    return { success: true, message: 'Account created successfully.' };
  } catch (err) {
    return { success: false, message: extractApiError(err, 'Registration failed.') };
  }
}

export async function logoutUser(): Promise<ActionResponse> {
  await prepareServerRequest();
  try { await authApi.logout(); } catch { /* ignore */ }
  clearCachedToken();
  await clearAuthCookies();
  return { success: true, message: 'Logged out.' };
}

export async function handleRequestPasswordReset(email: string): Promise<ActionResponse> {
  await prepareServerRequest();
  try {
    const res = await authApi.forgotPassword({ email });
    if (!res.success) return { success: false, message: res.message || 'Failed to send reset link.' };
    return { success: true, message: res.message || 'Password reset link sent to your email.' };
  } catch (err) {
    return { success: false, message: extractApiError(err, 'Failed to send reset link.') };
  }
}

export async function handleResetPassword(token: string, newPassword: string): Promise<ActionResponse> {
  await prepareServerRequest();
  try {
    const res = await authApi.resetPassword({ token, newPassword });
    if (!res.success) return { success: false, message: res.message || 'Failed to reset password.' };
    return { success: true, message: res.message || 'Password reset successfully!' };
  } catch (err) {
    return { success: false, message: extractApiError(err, 'Failed to reset password.') };
  }
}

export async function handleVerifyEmail(token: string): Promise<ActionResponse> {
  await prepareServerRequest();
  try {
    const res = await authApi.verifyEmail({ token });
    if (!res.success) return { success: false, message: res.message || 'Email verification failed.' };
    return { success: true, message: res.message || 'Email verified successfully!' };
  } catch (err) {
    return { success: false, message: extractApiError(err, 'Email verification failed.') };
  }
}

export async function updateProfileAction(
  data: Record<string, unknown>,
  imageFile: File | null = null,
): Promise<ActionResponse> {
  await prepareServerRequest();
  try {
    let body: Record<string, unknown> = { ...data };
    if (imageFile) {
      const formData = new FormData();
      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, String(value));
      });
      formData.append('profileImage', imageFile);
      body = formData as unknown as Record<string, unknown>;
    }
    const res = await authApi.updateProfile(body);
    if (!res.success) return { success: false, message: res.message || 'Failed to update profile.' };
    return { success: true, message: res.message || 'Profile updated successfully.' };
  } catch (err) {
    return { success: false, message: extractApiError(err, 'Failed to update profile.') };
  }
}

export async function handleUpdatePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<ActionResponse> {
  await prepareServerRequest();
  try {
    const res = await authApi.updatePassword(data);
    if (!res.success) return { success: false, message: res.message || 'Failed to update password.' };
    return { success: true, message: res.message || 'Password updated successfully.' };
  } catch (err) {
    return { success: false, message: extractApiError(err, 'Failed to update password.') };
  }
}

export async function getCurrentUser() {
  await prepareServerRequest();
  try {
    const res = await authApi.me();
    if (!res.success || !res.data) return null;
    return res.data;
  } catch {
    return null;
  }
}
