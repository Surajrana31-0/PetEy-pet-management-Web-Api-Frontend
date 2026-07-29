'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { logoutAction } from '@/lib/actions/auth-action';
import type { UserRole } from '@/lib/types';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const USER_NAV: NavItem[] = [
  { href: '/dashboard/user', label: 'Overview', icon: '🏠' },
  { href: '/dashboard/user/browse', label: 'Browse Pets', icon: '🐾' },
  { href: '/dashboard/user/appointments', label: 'Vet Appointments', icon: '🩺' },
  { href: '/dashboard/user/profile', label: 'My Profile', icon: '👤' },
  { href: '/dashboard/user/favorites', label: 'Favorite Pets', icon: '❤️' },
  { href: '/dashboard/user/applications', label: 'Applications', icon: '📋' },
  { href: '/dashboard/user/adoptions', label: 'My Adoptions', icon: '📝' },
  { href: '/dashboard/user/recommendations', label: 'AI Recommendations', icon: '✨' },
  { href: '/dashboard/user/chat-history', label: 'Chat History', icon: '💬' },
  { href: '/dashboard/user/settings', label: 'Settings', icon: '⚙️' },
];

const ADMIN_NAV: NavItem[] = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/admin/pets', label: 'Pet Management', icon: '🐾' },
  { href: '/dashboard/admin/vets', label: 'Veterinarians', icon: '🩺' },
  { href: '/dashboard/admin/appointments', label: 'Appointments', icon: '📅' },
  { href: '/dashboard/admin/applications', label: 'Adoptions', icon: '📋' },
  { href: '/dashboard/admin/analytics', label: 'Analytics', icon: '📈' },
];

function resolveImageUrl(profileImage: string | null | undefined): string | null {
  if (!profileImage) return null;
  if (profileImage.startsWith('http')) return profileImage;
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8088/api/v1').replace('/api/v1', '');
  return `${base}${profileImage}`;
}

export function DashboardNavbar({
  role,
  userName,
  profileImage,
}: {
  role: UserRole;
  userName: string;
  profileImage?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = role === 'ADMIN' ? ADMIN_NAV : USER_NAV;
  const dashboardHome = role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/user';
  const avatarUrl = resolveImageUrl(profileImage);
  const initial = userName.charAt(0).toUpperCase();

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-4">
        <Link href="/" className="flex items-center gap-2" onClick={onNavigate}>
          <span className="text-xl">🐾</span>
          <span className="font-bold">PetEy</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== dashboardHome && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <div className="mb-2 flex items-center gap-3 px-3 py-2">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={userName}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-orange-200"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-600">
              {initial}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{userName}</div>
            <div className="text-xs text-gray-500">{role === 'ADMIN' ? 'Administrator' : 'Member'}</div>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            🚪 Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-gray-200 bg-white lg:block">
        <SidebarContent />
      </aside>

      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🐾</span>
          <span className="font-bold">PetEy</span>
        </Link>
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={userName} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-600">
              {initial}
            </span>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
