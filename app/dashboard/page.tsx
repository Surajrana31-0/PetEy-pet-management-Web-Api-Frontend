import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { isAdmin, dashboardPathForRole } from '@/lib/auth/roles';

export default async function DashboardRedirectPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  redirect(dashboardPathForRole(isAdmin(user.role) ? 'ADMIN' : 'USER'));
}
