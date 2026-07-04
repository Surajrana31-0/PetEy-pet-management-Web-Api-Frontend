import Link from 'next/link';
// import { logoutAction } from '@/lib/actions/auth-action';
import { getDashboardPathForRole } from '@/lib/auth/roles';
import type { IUser } from '@/lib/types/auth';
import { UserRole } from '@/lib/types/auth';
import { logoutUser } from '@/lib/actions/auth-action';

interface NavbarProps {
  user: IUser;
  activePath?: string;
}

export default function Navbar({ user, activePath = '' }: NavbarProps) {
  const dashboardPath = getDashboardPathForRole(user.role);
  const isAdmin = user.role === UserRole.ADMIN;
  const initial = user.fullName.charAt(0).toUpperCase();

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`dash-nav-link${activePath === href ? ' dash-nav-link--active' : ''}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="dash-nav">
      <div className="dash-nav-inner">
        <Link href="/" className="logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-text">PETEY</span>
        </Link>

        <nav className="dash-nav-links">
          {navLink('/', 'Home')}
          {navLink(dashboardPath, isAdmin ? 'Dashboard' : 'My Dashboard')}
          {isAdmin
            ? navLink('/dashboard/admin/pets', 'Manage Pets')
            : navLink('/dashboard/user/browse', 'Browse Pets')}
        </nav>

        <div className="dash-nav-user">
          <div
            className="dash-hero-avatar"
            style={{ width: 36, height: 36, fontSize: 14 }}
            aria-hidden
          >
            {initial}
          </div>
          <span className="dash-nav-name hidden sm:inline">{user.fullName}</span>
          <span className={`dash-nav-role${isAdmin ? ' dash-nav-role--admin' : ''}`}>
            {user.role}
          </span>
          <form action={logoutUser} method="POST" className="ml-4">
            <button type="submit" className="dash-logout-btn">Logout</button>
          </form>
        </div>
      </div>
    </header>
  );
}
