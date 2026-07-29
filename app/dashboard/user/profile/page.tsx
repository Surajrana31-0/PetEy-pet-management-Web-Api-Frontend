import Link from 'next/link';
import { requireAuthenticatedUser } from '@/lib/auth/guards';
import { getDashboardPathForRole } from '@/lib/auth/roles';
import { EditProfileForm } from '@/app/dashboard/_components/EditProfileForm';
import type { IUser } from '@/lib/types/auth';

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
          <h1>My Profile</h1>
          <p>Keep your account information and photo up to date for a smoother adoption experience.</p>
        </div>
      </div>

      <ProfileAvatar user={user} />

      <EditProfileForm user={user} />
    </div>
  );
}

function ProfileAvatar({ user }: { user: IUser }) {
  const initial = user.fullName.charAt(0).toUpperCase();
  const imageUrl = user.profileImage
    ? user.profileImage.startsWith('http')
      ? user.profileImage
      : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') ?? ''}${user.profileImage}`
    : null;

  return (
    <div className="mb-6 flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-card">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={user.fullName}
          className="h-20 w-20 rounded-full object-cover ring-2 ring-brand/20"
        />
      ) : (
        <span className="flex h-20 w-20 items-center justify-center rounded-full gradient-warm text-2xl font-bold text-white">
          {initial}
        </span>
      )}
      <div>
        <h2 className="text-lg font-semibold">{user.fullName}</h2>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        {user.location && (
          <p className="mt-0.5 text-xs text-muted-foreground">{user.location}</p>
        )}
      </div>
    </div>
  );
}
