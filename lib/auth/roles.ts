import type { JWTPayload, UserRole } from '@/lib/types';

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    return decoded as JWTPayload;
  } catch {
    return null;
  }
}

export function isAdmin(role?: UserRole | string | null): boolean {
  return role === 'ADMIN';
}

export function isUser(role?: UserRole | string | null): boolean {
  return role === 'USER';
}

export function dashboardPathForRole(role?: UserRole | string | null): string {
  return isAdmin(role) ? '/dashboard/admin' : '/dashboard/user';
}

export const getDashboardPathForRole = dashboardPathForRole;

export function isSafeRedirect(target: string | null | undefined): boolean {
  if (!target) return false;
  return target.startsWith('/') && !target.startsWith('//');
}
