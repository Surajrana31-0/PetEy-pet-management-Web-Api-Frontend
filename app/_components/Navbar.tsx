import Link from 'next/link';
import { getDashboardPathForRole } from '@/lib/auth/roles';
import type { IUser } from '@/lib/types/auth';
import { UserRole } from '@/lib/types/auth';
import { logoutUser } from '@/lib/actions/auth-action';
import { Avatar } from '@/components/ui/avatar';
import { LayoutDashboard, Compass, PawPrint, LogOut, ArrowLeft, User, Settings } from 'lucide-react';

interface NavbarProps {
  user: IUser;
  activePath?: string;
}

export default function Navbar({ user, activePath = '' }: NavbarProps) {
  const dashboardPath = getDashboardPathForRole(user.role);
  const isAdmin = user.role === UserRole.ADMIN;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-lg">🐾</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              PETEY
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Main Site
            </Link>
            <Link
              href={dashboardPath}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activePath === dashboardPath || activePath === '/dashboard'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
            </Link>
            {isAdmin ? (
              <Link
                href="/dashboard/admin/pets"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activePath.includes('/admin/pets')
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <PawPrint className="w-3.5 h-3.5" />
                Manage Pets
              </Link>
            ) : (
              <Link
                href="/adopt"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activePath.includes('/adopt')
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Browse Catalogue
              </Link>
            )}
            <Link
              href="/dashboard/profile"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activePath.includes('/dashboard/profile')
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activePath.includes('/dashboard/settings')
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </Link>
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
            <Avatar src={user.profileImage} name={user.fullName} size="sm" />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {user.fullName}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isAdmin
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {user.role}
              </span>
            </div>

            <form action={logoutUser} method="POST">
              <button
                type="submit"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
