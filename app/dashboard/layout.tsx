import Navbar from '@/app/_components/Navbar';
import { requireAuthenticatedUser } from '@/lib/auth/guards';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuthenticatedUser();

  return (
    <div className="dash-layout">
      <Navbar user={user} />
      <main className="dash-main">{children}</main>
    </div>
  );
}
