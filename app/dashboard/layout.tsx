import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DashboardNavbar } from '@/components/dashboard/dashboard-navbar';
import { UserRole } from '@/lib/types';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar role={user.role as UserRole} userName={user.fullName} />
      <div className="lg:pl-64">
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
