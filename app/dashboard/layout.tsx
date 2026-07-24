import Navbar from '@/app/_components/Navbar';
import { DashboardShell } from '@/components/layout';
import { requireAuthenticatedUser } from '@/lib/auth/guards';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuthenticatedUser();

  return (
    <div className="dash-layout">
      <Navbar user={user} />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
