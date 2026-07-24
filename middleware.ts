import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  decodeAccessTokenRole,
  getDashboardPathForRole,
  isAdminRoute,
  isUserRoute,
} from './lib/auth/roles';
import { UserRole } from './lib/types/auth';

const AUTH_ROUTES = ['/login', '/register', '/forget-password', '/reset-password'];

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith('/dashboard');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth_token')?.value;
  const isAuthenticated = Boolean(authToken);
  const role = authToken ? decodeAccessTokenRole(authToken) : null;

  if (isDashboardRoute(pathname) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && role) {
    if (isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL(getDashboardPathForRole(role), request.url));
    }

    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL(getDashboardPathForRole(role), request.url));
    }

    if (isAdminRoute(pathname) && role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/dashboard/user', request.url));
    }

    if (isUserRoute(pathname) && role !== UserRole.USER) {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/forget-password', '/reset-password', '/dashboard/:path*'],
};
