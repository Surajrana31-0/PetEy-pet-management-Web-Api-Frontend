import { NextResponse, type NextRequest } from 'next/server';
import { decodeJWT } from '@/lib/auth/roles';

const PUBLIC_PATHS = ['/', '/login', '/register', '/forgot-password', '/forget-password', '/reset-password', '/verify-email', '/about', '/pets', '/api'];

function isPublicPath(pathname: string): boolean {
  if (pathname === '/') return true;
  return PUBLIC_PATHS.some((p) => {
    if (p === '/pets') return pathname.startsWith('/pets');
    return pathname === p || pathname.startsWith(p + '/');
  });
}

function getTokenFromCookies(req: NextRequest): string | null {
  const token = req.cookies.get('accessToken')?.value;
  if (!token) return null;
  const decoded = decodeJWT(token);
  return decoded?.role || null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = getTokenFromCookies(req);

  if (pathname === '/dashboard') {
    const target = role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/user';
    return NextResponse.redirect(new URL(target, req.url));
  }

  if (pathname.startsWith('/dashboard')) {
    if (!role) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/user', req.url));
    }
    if (pathname.startsWith('/dashboard/user') && role !== 'USER') {
      return NextResponse.redirect(new URL('/dashboard/admin', req.url));
    }
  }

  if ((pathname === '/login' || pathname === '/register') && role) {
    const target = role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/user';
    return NextResponse.redirect(new URL(target, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
