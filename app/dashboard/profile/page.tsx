import Link from 'next/link';
import { EditProfileForm } from '@/app/dashboard/_components/EditProfileForm';
import { requireAuthenticatedUser } from '@/lib/auth/guards';
import { getDashboardPathForRole } from '@/lib/auth/roles';

export default async function ProfilePage() {
  const user = await requireAuthenticatedUser();
  const dashboardPath = getDashboardPathForRole(user.role);

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <div>
          <Link href={dashboardPath} className="text-sm font-medium text-brand hover:underline">
            ← Back to dashboard
          </Link>
          <h1>Edit profile</h1>
          <p>Keep your account information up to date for a smoother adoption experience.</p>
        </div>
      </div>

      <EditProfileForm user={user} />
    </div>
  );
}
