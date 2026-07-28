'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type {
  ChangePasswordFormData,
  LoginFormData,
  ProfileFormData,
  RegisterFormData,
} from '@/lib/auth/schemas';
import { profileUpdate, updatePassword } from '@/lib/api/auth';
import { setUserInfoCookie } from '@/lib/cookies';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8088';

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

// ─── helpers ────────────────────────────────────────────────────────────────

async function serverPost(path: string, body: unknown, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  return res.json().catch(() => ({ success: false, message: 'Server error' }));
}

// ─── actions ────────────────────────────────────────────────────────────────

/**
 * Login — calls Express backend, then sets the tokens as browser cookies
 * via the Next.js cookies() API (not relying on backend Set-Cookie headers).
 */
export async function loginUser(data: LoginFormData) {
  try {
    const json = await serverPost('/api/v1/auth/login', data);

    if (!json.success) {
      return { success: false as const, message: json.message || 'Login failed' };
    }

    const { accessToken, refreshToken, user } = json.data;

    const cookieStore = await cookies();

    cookieStore.set('accessToken', accessToken, {
      ...COOKIE_BASE,
      maxAge: 15 * 60, // 15 minutes — matches backend
    });

    cookieStore.set('refreshToken', refreshToken, {
      ...COOKIE_BASE,
      maxAge: 7 * 24 * 60 * 60, // 7 days — matches backend
    });

    if (user) {
      cookieStore.set('user_data', JSON.stringify(user), {
        ...COOKIE_BASE,
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return { success: true as const, data: json.data };
  } catch (err) {
    return {
      success: false as const,
      message: err instanceof Error ? err.message : 'Login failed',
    };
  }
}

/**
 * Register — calls the backend, does NOT set auth cookies (user must verify
 * email / log in after registration).
 */
export async function registerUser(data: RegisterFormData) {
  try {
    const { confirmPassword, ...payload } = data;
    const json = await serverPost('/api/v1/auth/register', payload);
    return { success: json.success as boolean, message: json.message as string };
  } catch (err) {
    return {
      success: false as const,
      message: err instanceof Error ? err.message : 'Registration failed',
    };
  }
}

/**
 * Logout — clears auth cookies from the browser and invalidates the backend session.
 */
export async function logoutUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  // Tell backend to invalidate the session (best-effort — don't block on failure)
  if (token) {
    await serverPost('/api/v1/auth/logout', {}, token).catch(() => {});
  }

  // Always clear local cookies regardless of backend response
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}

/**
 * Request a password-reset link.
 */
export async function handleRequestPasswordReset(email: string) {
  try {
    const json = await serverPost('/api/v1/auth/forgot-password', { email });
    return { success: json.success as boolean, message: json.message as string };
  } catch (err) {
    return {
      success: false as const,
      message: err instanceof Error ? err.message : 'Failed to send reset link',
    };
  }
}

/**
 * Reset password using the token from the email link.
 */
export async function handleResetPassword(data: { token: string; newPassword: string }) {
  try {
    const json = await serverPost('/api/v1/auth/reset-password', data);
    return { success: json.success as boolean, message: json.message as string };
  } catch (err) {
    return {
      success: false as const,
      message: err instanceof Error ? err.message : 'Password reset failed',
    };
  }
}

/**
 * Verify email with the token from the verification link.
 */
export async function handleVerifyEmail(token: string) {
  try {
    const json = await serverPost('/api/v1/auth/verify-email', { token });
    return { success: json.success as boolean, message: json.message as string };
  } catch (err) {
    return {
      success: false as const,
      message: err instanceof Error ? err.message : 'Email verification failed',
    };
  }
}

/**
 * Refresh the access token using the stored refresh token.
 * Called automatically when the access token expires.
 */
export async function refreshAccessToken() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    if (!refreshToken) return { success: false as const, message: 'No refresh token' };

    const json = await serverPost('/api/v1/auth/refresh-token', { refreshToken });

    if (!json.success) {
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      return { success: false as const, message: json.message };
    }

    cookieStore.set('accessToken', json.data.accessToken, {
      ...COOKIE_BASE,
      maxAge: 15 * 60,
    });
    cookieStore.set('refreshToken', json.data.refreshToken, {
      ...COOKIE_BASE,
      maxAge: 7 * 24 * 60 * 60,
    });

    return { success: true as const };
  } catch {
    return { success: false as const, message: 'Token refresh failed' };
  }
}

type ActionResult = {
  success: boolean;
  message?: string;
  data?: unknown;
};

export async function updateProfileAction(data: ProfileFormData, imageFile?: File | null): Promise<ActionResult> {
  try {
    const formData = new FormData();
    formData.append('fullName', data.fullName);

    if (data.phoneNumber?.trim()) {
      formData.append('phoneNumber', data.phoneNumber.trim());
    }
    if (data.address?.trim()) {
      formData.append('address', data.address.trim());
    }
    if (data.location?.trim()) {
      formData.append('location', data.location.trim());
    }

    if (imageFile) {
      formData.append('profileImage', imageFile);
    }

    const result = await profileUpdate(formData);

    if (result.success) {
      if (result.data) {
        await setUserInfoCookie(result.data);
      }

      revalidatePath('/dashboard');
      revalidatePath('/dashboard/user');
      revalidatePath('/dashboard/profile');

      return {
        success: true,
        data: result.data ?? undefined,
        message: result.message || 'Profile updated successfully',
      };
    }

    return { success: false, message: result.message || 'Profile update failed' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Profile update failed',
    };
  }
}

export async function handleUpdatePassword(
  data: ChangePasswordFormData,
): Promise<ActionResult> {
  try {
    const { confirmPassword: _confirm, ...payload } = data;
    void _confirm;

    const result = await updatePassword(payload);

    if (result.success) {
      revalidatePath('/dashboard/settings');
      return {
        success: true,
        message: result.message || 'Password updated successfully',
      };
    }

    return { success: false, message: result.message || 'Password update failed' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Password update failed',
    };
  }
}