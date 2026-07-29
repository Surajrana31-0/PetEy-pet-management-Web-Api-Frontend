import { requireAdminRole } from '@/lib/auth/guards';
import { getAdminDashboardData } from '@/lib/actions/dashboard-actions';
import type { IAdminDashboardData } from '@/lib/types';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

export default async function AdminDashboardPage() {
  await requireAdminRole();

  let dashboard: IAdminDashboardData | null = null;
  let errorMsg: string | null = null;

  try {
    const res = await getAdminDashboardData();
    if (res.success && res.data) {
      dashboard = res.data;
    } else {
      errorMsg = res.message || 'Unable to load dashboard data';
    }
  } catch {
    errorMsg = 'Unable to connect to the server';
  }

  const overview = dashboard?.overview;
  const recentActivities = dashboard?.recentActivities ?? [];
  const trends = dashboard?.trends;
  const monthlyReports = dashboard?.monthlyReports;

  const stats = [
    { label: 'Total Pets', value: overview?.pets.total ?? 0, icon: '🐾' },
    { label: 'Available', value: overview?.pets.available ?? 0, icon: '✅' },
    { label: 'Pending Adoptions', value: overview?.adoptions.pending ?? 0, icon: '⏳' },
    { label: 'Completed', value: overview?.pets.adopted ?? 0, icon: '📈' },
    { label: 'Total Users', value: overview?.users.total ?? 0, icon: '👥' },
    { label: 'Total Blogs', value: overview?.blogs.total ?? 0, icon: '📝' },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Platform overview and recent activity.</p>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {errorMsg}. Showing available data.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-xl">
              {stat.icon}
            </span>
            <div className="mt-3 text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            📊 Recent Activity
          </h2>
          {recentActivities.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivities.slice(0, 8).map((activity) => (
                <div key={activity._id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50">
                  <div>
                    <div className="text-sm font-medium">{activity.description}</div>
                    <div className="text-xs text-gray-500">
                      {activity.actorName} · {activity.module} · {timeAgo(activity.createdAt)}
                    </div>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize">
                    {activity.action}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/dashboard/admin/pets/new" className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50">
              🐾 Add New Pet
            </Link>
            <Link href="/dashboard/admin/applications" className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50">
              📋 View Applications
            </Link>
            <Link href="/dashboard/admin/analytics" className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50">
              📈 Analytics
            </Link>
          </div>
        </div>
      </div>

      {trends && trends.statusCounts.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            📈 Adoption Trends
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {trends.statusCounts.map((item) => (
              <div key={item._id} className="rounded-lg border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold">{item.count}</div>
                <div className="text-xs capitalize text-gray-500">{item._id}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {monthlyReports && monthlyReports.adoptions.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Monthly Adoption Reports</h2>
          <div className="space-y-2">
            {monthlyReports.adoptions.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <span className="text-sm font-medium">
                  {MONTH_NAMES[item._id.month - 1]} {item._id.year}
                </span>
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-500">Total: <strong>{item.total}</strong></span>
                  {item.completed !== undefined && <span className="text-green-600">Completed: {item.completed}</span>}
                  {item.pending !== undefined && <span className="text-amber-600">Pending: {item.pending}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
