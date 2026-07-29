import { redirect } from 'next/navigation';
import { getCurrentUser } from './session';
import { isAdmin, isUser, dashboardPathForRole } from './roles';
import type { IUser } from '@/lib/types/auth';
import type { UserRole } from '@/lib/types/auth';

export async function requireAuthenticatedUser(): Promise<IUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireUserRole(): Promise<IUser> {
  const user = await requireAuthenticatedUser();
  if (isAdmin(user.role)) redirect('/dashboard/admin');
  return user;
}

export async function requireAdminRole(): Promise<IUser> {
  const user = await requireAuthenticatedUser();
  if (isUser(user.role)) redirect('/dashboard/user');
  return user;
}

export async function getRoleDashboard(): Promise<IUser> {
  const user = await requireAuthenticatedUser();
  redirect(dashboardPathForRole(user.role as UserRole));
}
