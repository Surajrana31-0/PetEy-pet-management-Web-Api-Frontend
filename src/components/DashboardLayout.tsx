import { type ReactNode } from 'react';
import { PawPrint, LogOut, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export type NavItem = {
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
};

export function DashboardLayout({ navItems, children, title }: { navItems: NavItem[]; children: ReactNode; title: string }) {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-screen">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center"><PawPrint className="w-5 h-5" /></div>
          <span className="text-lg font-bold text-gray-900">PetEy</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button key={item.label} onClick={item.onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition ${item.active ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
              <item.icon className="w-5 h-5" />{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold">{profile?.full_name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || 'U'}</div>
            <div className="min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name || 'User'}</p><p className="text-xs text-gray-400 truncate">{profile?.email}</p></div>
          </div>
          <button onClick={signOut} className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition text-sm"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>
      <div className="flex-1 ml-64">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-8"><h1 className="text-lg font-semibold text-gray-900">{title}</h1></header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
