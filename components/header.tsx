import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { getDashboardPathForRole } from '@/lib/auth/roles';
import { UserRole } from '@/lib/types/auth';
import { PawPrint, Menu, X } from 'lucide-react';

export default async function Header() {
  const user = await getCurrentUser();
  const dashboardPath = user ? getDashboardPathForRole(user.role) : '/login';

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/pets', label: 'Browse Pets' },
    { href: '/ai-matcher', label: 'AI Match' },
    { href: '/vets', label: 'Vets' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-warm text-white shadow-soft transition-transform group-hover:scale-105">
              <PawPrint className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight">PetEy</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href={dashboardPath}
              className="inline-flex items-center justify-center rounded-xl gradient-warm px-5 py-2 text-sm font-semibold text-white shadow-soft transition-all hover:shadow-glow hover:scale-[1.02]"
            >
              {user.role === UserRole.ADMIN ? 'Admin Dashboard' : 'My Dashboard'}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl gradient-warm px-5 py-2 text-sm font-semibold text-white shadow-soft transition-all hover:shadow-glow hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
