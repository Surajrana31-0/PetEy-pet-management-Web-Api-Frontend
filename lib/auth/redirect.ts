import { getDashboardPathForRole, isSafeRedirect } from './roles';
import type { IUser } from '../types/auth';

export function getPostLoginPath(user: IUser, redirectTo?: string | null): string {
  if (redirectTo && isSafeRedirect(redirectTo)) {
    return redirectTo;
  }
  return getDashboardPathForRole(user.role);
}
