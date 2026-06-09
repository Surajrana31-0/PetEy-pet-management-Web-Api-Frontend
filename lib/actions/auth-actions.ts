'use server';

import { authApi } from '../api/auth';

export interface ISchemaActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function registerAction(data: Record<string, string>): Promise<ISchemaActionResponse> {
  try {
    const response = await authApi.register(data);
    return { success: true, message: response.message };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || 'Registration structural processing validation failed.' };
  }
}

export async function loginAction(data: Record<string, string>): Promise<ISchemaActionResponse> {
  try {
    const response = await authApi.login(data);
    return { success: true, message: response.message };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || 'Login flow authorization validation rejected.' };
  }
}

export async function logoutAction(): Promise<ISchemaActionResponse> {
  try {
    await authApi.logout();
    return { success: true };
  } catch {
    return { success: false, error: 'Authorization cookie cache flush execution state aborted.' };
  }
}