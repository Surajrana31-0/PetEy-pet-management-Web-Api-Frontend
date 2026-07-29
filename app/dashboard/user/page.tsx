import { requireUserRole } from '@/lib/auth/guards';
import { getUserDashboardData } from '@/lib/actions/dashboard-actions';
import type { INotification } from '@/lib/types';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default async function UserDashboardPage() {
  const user = await requireUserRole();

  let notifications: INotification[] = [];
  let unreadCount = 0;
  let myApplications: unknown[] = [];
  let errorMsg: string | null = null;

  try {
    const res = await getUserDashboardData();
    if (res.success) {
      notifications = res.notifications ?? [];
      unreadCount = res.unreadCount ?? 0;
      myApplications = res.myApplications ?? [];
    } else {
      errorMsg = res.message;
    }
  } catch {
    errorMsg = 'Unable to load dashboard data';
  }

  const quickStats = [
    { label: 'Unread Notifications', value: unreadCount, icon: '🔔' },
    { label: 'My Applications', value: myApplications.length, icon: '📋' },
    { label: 'Favorite Pets', value: user.favorites?.length ?? 0, icon: '❤️' },
    { label: 'AI Chat', value: 0, icon: '💬' },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user.fullName.split(' ')[0]}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s what&apos;s happening with your adoption journey.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {errorMsg}. Showing available data.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-xl">
                {stat.icon}
              </span>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="mt-3 text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center justify-between text-lg font-semibold">
            <span className="flex items-center gap-2">🔔 Notifications</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-600">
                {unreadCount} unread
              </span>
            )}
          </h2>
          {notifications.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No notifications yet. You&apos;ll see updates about your applications here.
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50 ${
                    !notif.read ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-gray-500">{notif.message}</p>
                    <p className="mt-1 text-xs text-gray-400">{timeAgo(notif.createdAt)}</p>
                  </div>
                  {!notif.read && (
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            ✨ Quick Actions
          </h2>
          <div className="space-y-3">
            <Link href="/pets" className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50">
              🐾 Browse Pets
            </Link>
            <Link href="/ai-matcher" className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50">
              ✨ AI Pet Matcher
            </Link>
            <Link href="/dashboard/user/favorites" className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50">
              ❤️ View Favorites
            </Link>
            <Link href="/dashboard/user/applications" className="block w-full rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-left text-sm font-semibold text-white hover:shadow-md">
              📋 My Applications
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h3 className="text-lg font-semibold">Looking for your perfect match?</h3>
            <p className="mt-1 text-sm text-gray-500">
              Let our AI analyze your preferences and find the ideal companion.
            </p>
          </div>
          <Link
            href="/ai-matcher"
            className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
          >
            Try AI Matcher →
          </Link>
        </div>
      </div>
    </div>
  );
}
