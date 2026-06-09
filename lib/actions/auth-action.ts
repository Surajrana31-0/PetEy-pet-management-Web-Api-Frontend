'use server';

import { redirect } from 'next/navigation';
import { getDashboardPathForRole, isSafeRedirect } from '../auth/roles';
import { authApi } from '../api/auth';
import type { IAuthActionResponse, ILoginPayload, IRegisterPayload } from '../types/auth';
import { UserRole } from '../types/auth';

export async function registerAction(data: IRegisterPayload): Promise<IAuthActionResponse> {
  try {
    const response = await authApi.register({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });

    return {
      success: true,
      message: response.message || 'Registration successful',
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed.';
    return { success: false, error: message };
  }
}

export async function loginAction(
  data: ILoginPayload,
  redirectTo?: string,
): Promise<IAuthActionResponse> {
  try {
    const response = await authApi.login({
      email: data.email,
      password: data.password,
    });

    if (!response.success || !response.data) {
      return { success: false, error: response.message || 'Login failed.' };
    }

    const role = response.data.role as UserRole;
    const defaultPath = getDashboardPathForRole(role);
    const targetPath =
      redirectTo && isSafeRedirect(redirectTo, role) ? redirectTo : defaultPath;

    redirect(targetPath);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login failed.';
    return { success: false, error: message };
  }

  return { success: true };
}

export async function logoutAction(): Promise<void> {
  try {
    await authApi.logout();
  } catch {
    // Continue redirect even if backend logout fails so client session is cleared.
  }

  redirect('/login');
}
