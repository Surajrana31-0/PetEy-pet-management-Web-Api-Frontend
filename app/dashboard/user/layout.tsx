import { requireUserRole } from '@/lib/auth/guards';

export default async function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUserRole();
  return <>{children}</>;
}
