import { requireAdminRole } from '@/lib/auth/guards';
import { getAdminDashboardData } from '@/lib/actions/dashboard-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint, Check, Clock, Users, TrendingUp, Sparkles, ArrowRight, FileText, Activity, Blog } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { IAdminDashboardData } from '@/lib/types';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr);
}

export default async function AdminDashboardPage() {
  const user = await requireAdminRole();

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
    { label: 'Total Pets', value: overview?.pets.total ?? 0, icon: PawPrint, color: 'bg-primary/10 text-primary' },
    { label: 'Available', value: overview?.pets.available ?? 0, icon: Check, color: 'bg-success/10 text-success' },
    { label: 'Pending Adoptions', value: overview?.adoptions.pending ?? 0, icon: Clock, color: 'bg-warning/10 text-warning' },
    { label: 'Completed', value: overview?.pets.adopted ?? 0, icon: TrendingUp, color: 'bg-accent/10 text-accent' },
    { label: 'Total Users', value: overview?.users.total ?? 0, icon: Users, color: 'bg-primary/10 text-primary' },
    { label: 'Total Blogs', value: overview?.blogs.total ?? 0, icon: Blog, color: 'bg-accent/10 text-accent' },
  ];

  const QUICK_ACTIONS = [
    { label: 'Add New Pet', href: '/dashboard/admin/pets/new', icon: PawPrint },
    { label: 'View Applications', href: '/dashboard/admin/applications', icon: FileText },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: TrendingUp },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform overview and recent activity.</p>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {errorMsg}. Showing available data.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border/60 shadow-card transition-all hover:shadow-glow">
              <CardContent className="p-4">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-3 text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Recent Activity
              </span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/admin/analytics">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {recentActivities.slice(0, 8).map((activity) => (
                  <div key={activity._id} className="flex items-center justify-between rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <div>
                        <div className="text-sm font-medium">{activity.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {activity.actorName} · {activity.module} · {timeAgo(activity.createdAt)}
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                      {activity.action}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Button key={action.label} asChild variant="outline" className="w-full justify-start">
                  <Link href={action.href}>
                    <Icon className="mr-2 h-4 w-4" /> {action.label}
                  </Link>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {trends && trends.statusCounts.length > 0 && (
        <Card className="mt-6 border-border/60 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Adoption Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {trends.statusCounts.map((item) => (
                <div key={item._id} className="rounded-lg border border-border/60 p-4 text-center">
                  <div className="text-2xl font-bold">{item.count}</div>
                  <div className="text-xs capitalize text-muted-foreground">{item._id}</div>
                </div>
              ))}
            </div>
            {trends.speciesAdoption.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">Completed Adoptions by Species</h4>
                <div className="flex gap-4">
                  {trends.speciesAdoption.map((item) => (
                    <div key={item._id} className="rounded-lg bg-muted/50 px-4 py-2">
                      <span className="text-lg font-bold">{item.count}</span>
                      <span className="ml-2 text-sm text-muted-foreground">{item._id}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {monthlyReports && monthlyReports.adoptions.length > 0 && (
        <Card className="mt-6 border-border/60 shadow-card">
          <CardHeader>
            <CardTitle>Monthly Adoption Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {monthlyReports.adoptions.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                  <span className="text-sm font-medium">
                    {MONTH_NAMES[item._id.month - 1]} {item._id.year}
                  </span>
                  <div className="flex gap-4 text-xs">
                    <span className="text-muted-foreground">Total: <strong className="text-foreground">{item.total}</strong></span>
                    {item.completed !== undefined && <span className="text-success">Completed: {item.completed}</span>}
                    {item.pending !== undefined && <span className="text-warning">Pending: {item.pending}</span>}
                    {item.rejected !== undefined && <span className="text-destructive">Rejected: {item.rejected}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
