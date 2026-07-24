import Link from 'next/link';
import { ChangePasswordForm } from '@/app/dashboard/_components/ChangePasswordForm';
import { requireAuthenticatedUser } from '@/lib/auth/guards';
import { getDashboardPathForRole } from '@/lib/auth/roles';

export default async function SettingsPage() {
  const user = await requireAuthenticatedUser();
  const dashboardPath = getDashboardPathForRole(user.role);

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <div>
          <Link href={dashboardPath} className="text-sm font-medium text-brand hover:underline">
            ← Back to dashboard
          </Link>
          <h1>Account settings</h1>
          <p>Manage your security preferences and keep your account protected.</p>
        </div>
      </div>

      <ChangePasswordForm />
    </div>
  );
}
