import { redirect } from 'next/navigation';
import { requireAdminRole } from '@/lib/auth/guards';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminRole();
  return <>{children}</>;
}
