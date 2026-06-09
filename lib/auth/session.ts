import { authApi } from '../api/auth';
import type { IUser } from '../types/auth';

export async function getCurrentUser(): Promise<IUser | null> {
  try {
    const response = await authApi.me();
    return response.success ? response.data : null;
  } catch {
    return null;
  }
}
