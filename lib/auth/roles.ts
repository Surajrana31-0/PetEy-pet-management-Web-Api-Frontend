import { UserRole } from '../types/auth';

export function getDashboardPathForRole(role: UserRole): string {
  return role === UserRole.ADMIN ? '/dashboard/admin' : '/dashboard/user';
}

export function decodeAccessTokenRole(token: string): UserRole | null {
  try {
    const payloadSegment = token.split('.')[1];
    if (!payloadSegment) {
      return null;
    }

    const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized)) as { role?: string };

    if (decoded.role === UserRole.ADMIN) {
      return UserRole.ADMIN;
    }

    if (decoded.role === UserRole.USER) {
      return UserRole.USER;
    }

    return null;
  } catch {
    return null;
  }
}

export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/dashboard/admin');
}

export function isUserRoute(pathname: string): boolean {
  return pathname.startsWith('/dashboard/user');
}

export function isSafeRedirect(pathname: string, role: UserRole): boolean {
  if (!pathname.startsWith('/dashboard')) {
    return false;
  }

  if (isAdminRoute(pathname)) {
    return role === UserRole.ADMIN;
  }

  if (isUserRoute(pathname)) {
    return role === UserRole.USER;
  }

  return true;
}
