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

export interface ActionResponse {
  success: boolean;
  message?: string;
  data?: unknown;
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

  try {
    const res = await authApi.register({ fullName, username, email, password });
    if (!res.success) return { error: res.message || 'Registration failed.', success: false };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Registration failed.', success: false };
  }

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

  let role: UserRole = 'USER';
  try {
    const res = await authApi.login({ email, password });
    if (!res.success || !res.data) {
      return { error: res.message || 'Login failed.', success: false };
    }
    role = (res.data.user?.role as UserRole) || 'USER';
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Login failed.', success: false };
  }

  if (redirectTarget && redirectTarget.startsWith('/') && !redirectTarget.startsWith('//')) {
    redirect(redirectTarget);
  }

  redirect(dashboardPathForRole(role));
}

export async function logoutAction(): Promise<void> {
  try { await authApi.logout(); } catch { /* ignore */ }
  await clearAuthCookies();
  redirect('/login');
}

export async function loginUser(data: { email: string; password: string }): Promise<ActionResponse> {
  try {
    const res = await authApi.login({ email: data.email, password: data.password });
    if (!res.success || !res.data) return { success: false, message: res.message || 'Login failed.' };
    return { success: true, message: 'Login successful.', data: res.data };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Login failed.' };
  }
}

export async function registerUser(data: { fullName: string; username: string; email: string; password: string }): Promise<ActionResponse> {
  try {
    const res = await authApi.register(data);
    if (!res.success) return { success: false, message: res.message || 'Registration failed.' };
    return { success: true, message: 'Account created successfully.' };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Registration failed.' };
  }
}

export async function logoutUser(): Promise<ActionResponse> {
  try { await authApi.logout(); } catch { /* ignore */ }
  await clearAuthCookies();
  return { success: true, message: 'Logged out.' };
}

export async function handleRequestPasswordReset(email: string): Promise<ActionResponse> {
  try {
    const res = await authApi.forgotPassword({ email });
    if (!res.success) return { success: false, message: res.message || 'Failed to send reset link.' };
    return { success: true, message: res.message || 'Password reset link sent to your email.' };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Failed to send reset link.' };
  }
}

export async function handleResetPassword(token: string, newPassword: string): Promise<ActionResponse> {
  try {
    const res = await authApi.resetPassword({ token, newPassword });
    if (!res.success) return { success: false, message: res.message || 'Failed to reset password.' };
    return { success: true, message: res.message || 'Password reset successfully!' };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Failed to reset password.' };
  }
}

export async function handleVerifyEmail(token: string): Promise<ActionResponse> {
  try {
    const res = await authApi.verifyEmail({ token });
    if (!res.success) return { success: false, message: res.message || 'Email verification failed.' };
    return { success: true, message: res.message || 'Email verified successfully!' };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Email verification failed.' };
  }
}

export async function updateProfileAction(data: Record<string, unknown>, imageFile: File | null = null): Promise<ActionResponse> {
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
    return { success: false, message: err instanceof Error ? err.message : 'Failed to update profile.' };
  }
}

export async function handleUpdatePassword(data: { currentPassword: string; newPassword: string }): Promise<ActionResponse> {
  try {
    const res = await authApi.updatePassword(data);
    if (!res.success) return { success: false, message: res.message || 'Failed to update password.' };
    return { success: true, message: res.message || 'Password updated successfully.' };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Failed to update password.' };
  }
}
