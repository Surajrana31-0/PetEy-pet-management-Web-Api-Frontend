'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  PawPrint,
  FileText,
  Users,
  Stethoscope,
  BookOpen,
  Compass,
  Heart,
  CalendarDays,
  User,
  Settings,
  ShieldCheck,
  ArrowLeft,
  X,
} from 'lucide-react';
import type { IUser } from '@/lib/types/auth';
import { UserRole } from '@/lib/types/auth';
import { getDashboardPathForRole } from '@/lib/auth/roles';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  user: IUser;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPrefix?: string;
}

const adminNav: NavItem[] = [
  { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard, matchPrefix: '/dashboard/admin' },
  { href: '/dashboard/admin/pets', label: 'Manage Pets', icon: PawPrint, matchPrefix: '/dashboard/admin/pets' },
  { href: '/dashboard/admin/adoptions', label: 'Adoptions', icon: FileText, matchPrefix: '/dashboard/admin/adoptions' },
  { href: '/dashboard/admin/users', label: 'Users & RBAC', icon: Users, matchPrefix: '/dashboard/admin/users' },
  { href: '/dashboard/admin/vets', label: 'Veterinarians', icon: Stethoscope, matchPrefix: '/dashboard/admin/vets' },
  { href: '/dashboard/admin/blogs', label: 'Blog & Articles', icon: BookOpen, matchPrefix: '/dashboard/admin/blogs' },
];

const userNav: NavItem[] = [
  { href: '/dashboard/user', label: 'Overview', icon: LayoutDashboard, matchPrefix: '/dashboard/user' },
  { href: '/dashboard/user/browse', label: 'Browse Pets', icon: Compass, matchPrefix: '/dashboard/user/browse' },
  { href: '/dashboard/user/adoptions', label: 'My Applications', icon: FileText, matchPrefix: '/dashboard/user/adoptions' },
  { href: '/dashboard/user/favorites', label: 'Saved Pets', icon: Heart, matchPrefix: '/dashboard/user/favorites' },
  { href: '/dashboard/user/appointments', label: 'Appointments', icon: CalendarDays, matchPrefix: '/dashboard/user/appointments' },
];

const sharedNav: NavItem[] = [
  { href: '/dashboard/profile', label: 'Profile', icon: User, matchPrefix: '/dashboard/profile' },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, matchPrefix: '/dashboard/settings' },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user.role === UserRole.ADMIN;
  const primaryNav = isAdmin ? adminNav : userNav;
  const dashboardPath = getDashboardPathForRole(user.role);

  const isActive = (item: NavItem) => {
    if (item.href === dashboardPath) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.matchPrefix || item.href);
  };

  const renderNav = (items: NavItem[], closeOnNavigate = true) => (
    <nav className="dash-sidebar-nav">
      {items.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => closeOnNavigate && setMobileOpen(false)}
            className={cn('dash-sidebar-link', active && 'dash-sidebar-link--active')}
          >
            <Icon className="dash-sidebar-link-icon" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const sidebarContent = (
    <div className="dash-sidebar-inner">
      <div className="dash-sidebar-brand">
        <Link href="/" className="dash-sidebar-logo">
          <span className="dash-sidebar-logo-icon">🐾</span>
          <span className="dash-sidebar-logo-text">PETEY</span>
        </Link>
        <button
          className="dash-sidebar-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="dash-sidebar-user">
        <div className="dash-sidebar-user-avatar">
          {user.profileImage ? (
            <img
              src={
                user.profileImage.startsWith('http')
                  ? user.profileImage
                  : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088'}${user.profileImage}`
              }
              alt={user.fullName}
              className="dash-sidebar-user-img"
            />
          ) : (
            <span className="dash-sidebar-user-initials">
              {user.fullName
                ?.split(' ')
                .slice(0, 2)
                .map((p) => p[0])
                .join('')
                .toUpperCase()}
            </span>
          )}
        </div>
        <div className="dash-sidebar-user-info">
          <span className="dash-sidebar-user-name">{user.fullName}</span>
          <span
            className={cn(
              'dash-sidebar-user-role',
              isAdmin ? 'dash-sidebar-user-role--admin' : 'dash-sidebar-user-role--user',
            )}
          >
            {isAdmin ? 'Administrator' : 'Adopter'}
          </span>
        </div>
      </div>

      <div className="dash-sidebar-section">
        <span className="dash-sidebar-section-title">{isAdmin ? 'Admin Panel' : 'My Account'}</span>
        {renderNav(primaryNav)}
      </div>

      <div className="dash-sidebar-section">
        <span className="dash-sidebar-section-title">Account</span>
        {renderNav(sharedNav)}
      </div>

      <div className="dash-sidebar-footer">
        <Link href="/" className="dash-sidebar-back">
          <ArrowLeft className="w-4 h-4" />
          Back to Site
        </Link>
        <div className="dash-sidebar-copyright">
          © 2024 PetEy. Made with ♥ for pets.
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="dash-sidebar">{sidebarContent}</aside>

      <div
        className={cn('dash-sidebar-overlay', mobileOpen && 'dash-sidebar-overlay--open')}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={cn('dash-sidebar-mobile', mobileOpen && 'dash-sidebar-mobile--open')}>
        {sidebarContent}
      </aside>

      <button
        className="dash-sidebar-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </>
  );
}
