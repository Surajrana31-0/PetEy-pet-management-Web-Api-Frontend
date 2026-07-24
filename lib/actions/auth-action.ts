'use server';

import {
  login,
  logout,
  register,
  requestPasswordReset,
  resetPassword,
  whoami,
  profileUpdate,
} from '@/lib/api/auth';
import {
  type LoginFormData,
  type RegisterFormData,
} from '@/lib/auth/schemas';
import { clearAuthCookies, getTokenCookie, setTokenCookie, setUserInfoCookie } from '../cookies';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ILoginResponseData } from '../types/auth';

type ActionResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

export async function registerUser(
  data: RegisterFormData,
): Promise<ActionResult> {
  try {
    const { confirmPassword: _confirm, ...payload } = data;
    void _confirm;

    const result = await register(payload);

    if (result.success) {
      return {
        success: true,
        message: result.message || 'Registration successful',
        data: result.data ?? undefined,
      };
    }

    return { success: false, message: result.message || 'Registration failed' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}

export async function loginUser(
  data: LoginFormData,
): Promise<ActionResult<ILoginResponseData>> {
  try {
    const result = await login(data);

    if (result.success && result.data) {
      const { user, accessToken } = result.data;

      if (accessToken) {
        await setTokenCookie(accessToken);
      }
      if (user) {
        await setUserInfoCookie(user);
      }

      revalidatePath('/dashboard');

      return {
        success: true,
        data: result.data,
        message: result.message || 'Login successful',
      };
    }

    return { success: false, message: result.message || 'Login failed' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

export async function validateSession() {
  const token = await getTokenCookie();
  if (!token) {
    return { valid: false as const };
  }

  try {
    const result = await whoami();

    if (result.success && result.data) {
      await setUserInfoCookie(result.data);
      return { valid: true as const, user: result.data };
    }

    await clearAuthCookies();
    return { valid: false as const };
  } catch {
    await clearAuthCookies();
    return { valid: false as const };
  }
}

export async function getUserData() {
  try {
    const result = await whoami();

    if (result.success && result.data) {
      await setUserInfoCookie(result.data);
      return {
        success: true,
        data: result.data,
        message: result.message || 'Profile loaded',
      };
    }

    return { success: false, message: result.message || 'Failed to load profile' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to load profile',
    };
  }
}

export async function handleUpdateProfile(data: FormData): Promise<ActionResult> {
  try {
    const result = await profileUpdate(data);

    if (result.success) {
      if (result.data) {
        await setUserInfoCookie(result.data);
      }
      revalidatePath('/dashboard');
      return {
        success: true,
        data: result.data ?? undefined,
        message: result.message || 'Profile updated',
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

export async function handleRequestPasswordReset(email: string): Promise<ActionResult> {
  try {
    const result = await requestPasswordReset(email);

    if (result.success) {
      return { success: true, message: result.message || 'Password reset email sent' };
    }

    return { success: false, message: result.message || 'Request password reset failed' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Request password reset failed',
    };
  }
}

export async function handleResetPassword(
  token: string,
  newPassword: string,
): Promise<ActionResult> {
  try {
    const result = await resetPassword(token, newPassword);

    if (result.success) {
      return { success: true, message: result.message || 'Password reset successful' };
    }

    return { success: false, message: result.message || 'Reset password failed' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Reset password failed',
    };
  }
}

export async function logoutUser(): Promise<void> {
  try {
    const token = await getTokenCookie();
    if (token) {
      try {
        await logout();
      } catch {
        // Continue clearing local session even if backend logout fails
      }
    }

    await clearAuthCookies();
    revalidatePath('/');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Logout failed:', error);
    throw new Error('Logout failed. Please try again.');
  }

  redirect('/login');
}
