import { redirect } from 'next/navigation';
import { requireUserRole } from '@/lib/auth/guards';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  await requireUserRole();
  return <>{children}</>;
}
