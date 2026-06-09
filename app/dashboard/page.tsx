import { redirectToRoleDashboard } from '@/lib/auth/guards';

export default async function DashboardIndexPage() {
  await redirectToRoleDashboard();
}
