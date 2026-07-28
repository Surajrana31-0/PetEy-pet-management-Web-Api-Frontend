import Link from 'next/link';
import { getDashboardPathForRole } from '@/lib/auth/roles';
import { getCurrentUser } from '@/lib/auth/session';
import { UserRole } from '@/lib/types/auth';

export default async function Header() {
  const user = await getCurrentUser();
  const dashboardPath = user ? getDashboardPathForRole(user.role) : '/login';

  const adoptHref = user ? '/adopt' : '/login?redirect=/adopt';
  const vetsHref = user ? '/vets' : '/login?redirect=/vets';
  const aiHref = user ? '/ai-assistant' : '/login?redirect=/ai-assistant';

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-text">PETEY</span>
        </Link>

        <nav className="nav-links">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href={adoptHref} className="nav-link">
            Adopt
          </Link>
          <Link href={vetsHref} className="nav-link">
            Vets
          </Link>
          <Link href={aiHref} className="nav-link">
            AI Match
          </Link>
          <Link href="/blog" className="nav-link">
            Blog
          </Link>
          <Link href="/about" className="nav-link">
            About
          </Link>
        </nav>

        <div className="nav-auth">
          {user ? (
            <Link href={dashboardPath} className="btn-primary signup-btn">
              {user.role === UserRole.ADMIN ? 'Admin Dashboard' : 'My Dashboard'}
            </Link>
          ) : (
            <>
              <Link href="/login" className="login-link">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Login
              </Link>
              <Link href="/register" className="btn-primary signup-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
