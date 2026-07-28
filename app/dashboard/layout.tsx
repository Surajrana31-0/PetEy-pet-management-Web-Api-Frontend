import Sidebar from '@/app/_components/Sidebar';
import DashboardHeader from '@/app/_components/DashboardHeader';
import { DashboardShell, DashboardFooter } from '@/components/layout';
import { requireAuthenticatedUser } from '@/lib/auth/guards';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuthenticatedUser();

  return (
    <div className="dash-layout">
      <DashboardShell
        sidebar={<Sidebar user={user} />}
        header={<DashboardHeader user={user} />}
        footer={<DashboardFooter />}
      >
        {children}
      </DashboardShell>
    </div>
  );
}
