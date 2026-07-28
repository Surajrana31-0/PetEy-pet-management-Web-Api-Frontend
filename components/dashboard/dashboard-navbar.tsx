'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PawPrint, LayoutDashboard, Heart, FileText, Sparkles, MessageSquare, Settings, User, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState } from 'react';
import { logoutAction } from '@/lib/actions/auth-action';
import type { UserRole } from '@/lib/types';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const USER_NAV: NavItem[] = [
  { href: '/dashboard/user', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/user/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/user/favorites', label: 'Favorite Pets', icon: Heart },
  { href: '/dashboard/user/applications', label: 'Applications', icon: FileText },
  { href: '/dashboard/user/recommendations', label: 'AI Recommendations', icon: Sparkles },
  { href: '/dashboard/user/chat-history', label: 'Chat History', icon: MessageSquare },
  { href: '/dashboard/user/settings', label: 'Settings', icon: Settings },
];

const ADMIN_NAV: NavItem[] = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/admin/pets', label: 'Pet Management', icon: PawPrint },
  { href: '/dashboard/admin/applications', label: 'Adoptions', icon: FileText },
  { href: '/dashboard/admin/analytics', label: 'Analytics', icon: LayoutDashboard },
];

export function DashboardNavbar({ role, userName }: { role: UserRole; userName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = role === 'ADMIN' ? ADMIN_NAV : USER_NAV;
  const dashboardHome = role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/user';

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2" onClick={onNavigate}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-warm text-white">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="font-bold">PetEy</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== dashboardHome && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-3 px-3 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
            {userName.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{userName}</div>
            <div className="text-xs text-muted-foreground">{role === 'ADMIN' ? 'Administrator' : 'Member'}</div>
          </div>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card lg:block">
        <SidebarContent />
      </aside>

      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border glass px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-warm text-white">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="font-bold">PetEy</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
