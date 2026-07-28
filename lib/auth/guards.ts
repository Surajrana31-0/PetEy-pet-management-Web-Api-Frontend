import { redirect } from 'next/navigation';
import { getDashboardPathForRole } from './roles';
import { getCurrentUser } from './session';
import type { IUser } from '../types/auth';

export async function requireAuthenticatedUser(): Promise<IUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireUserRole(): Promise<IUser> {
  const user = await requireAuthenticatedUser();
  const role = String(user.role).toUpperCase();
  if (role === 'ADMIN') {
    redirect('/dashboard/admin');
  }
  return user;
}

export async function requireAdminRole(): Promise<IUser> {
  const user = await requireAuthenticatedUser();
  const role = String(user.role).toUpperCase();
  if (role !== 'ADMIN') {
    redirect('/dashboard/user');
  }
  return user;
}

export async function redirectToRoleDashboard(): Promise<never> {
  const user = await requireAuthenticatedUser();
  redirect(getDashboardPathForRole(user.role));
}
