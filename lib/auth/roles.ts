import { UserRole } from '../types/auth';

export function getDashboardPathForRole(role: UserRole | string): string {
  const r = String(role || '').toUpperCase();
  return r === 'ADMIN' ? '/dashboard/admin' : '/dashboard/user';
}

export function decodeAccessTokenRole(token: string): UserRole | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (payload.length % 4 !== 0) {
      payload += '=';
    }

    let decodedJson = '';
    if (typeof Buffer !== 'undefined') {
      decodedJson = Buffer.from(payload, 'base64').toString('utf8');
    } else if (typeof atob !== 'undefined') {
      decodedJson = atob(payload);
    } else {
      return null;
    }

    const parsed = JSON.parse(decodedJson) as { role?: string };
    const r = String(parsed.role || '').toUpperCase();

    if (r === 'ADMIN') return UserRole.ADMIN;
    if (r === 'USER') return UserRole.USER;

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

export function isSafeRedirect(pathname: string, role: UserRole | string): boolean {
  if (!pathname.startsWith('/dashboard')) {
    return false;
  }

  const r = String(role || '').toUpperCase();
  if (isAdminRoute(pathname)) {
    return r === 'ADMIN';
  }

  if (isUserRoute(pathname)) {
    return r === 'USER';
  }

  return true;
}
