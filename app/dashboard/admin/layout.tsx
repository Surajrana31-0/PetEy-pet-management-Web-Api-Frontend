import { requireAdminRole } from '@/lib/auth/guards';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdminRole();
  return <>{children}</>;
}
