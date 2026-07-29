import { requireUserRole } from '@/lib/auth/guards';
import { getUserDashboardData } from '@/lib/actions/dashboard-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, FileText, Sparkles, MessageSquare, PawPrint, ArrowRight, Clock, Bell, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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

function getNotificationIcon(type: string) {
  switch (type) {
    case 'adoption_approved':
    case 'adoption_completed':
      return Check;
    case 'adoption_rejected':
    case 'user_suspended':
      return Bell;
    case 'blog_published':
      return FileText;
    case 'pet_created':
      return PawPrint;
    default:
      return Bell;
  }
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

  const QUICK_STATS = [
    { label: 'Unread Notifications', value: unreadCount, icon: Bell, color: 'bg-primary/10 text-primary' },
    { label: 'My Applications', value: myApplications.length, icon: FileText, color: 'bg-warning/10 text-warning' },
    { label: 'Favorite Pets', value: user.favorites?.length ?? 0, icon: Heart, color: 'bg-destructive/10 text-destructive' },
    { label: 'AI Chat', value: 0, icon: MessageSquare, color: 'bg-accent/10 text-accent' },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user.fullName.split(' ')[0]}!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your adoption journey.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {errorMsg}. Showing available data.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {QUICK_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border/60 shadow-card transition-all hover:shadow-glow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{stat.label}</p>
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
                <Bell className="h-5 w-5 text-primary" /> Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {unreadCount} unread
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No notifications yet. You&apos;ll see updates about your applications here.
              </p>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => {
                  const Icon = getNotificationIcon(notif.type);
                  return (
                    <div
                      key={notif._id}
                      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                        !notif.read ? 'border-primary/30 bg-primary/5' : 'border-border/60'
                      }`}
                    >
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs text-muted-foreground">{notif.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{timeAgo(notif.createdAt)}</p>
                      </div>
                      {!notif.read && (
                        <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/pets">
                <PawPrint className="mr-2 h-4 w-4" /> Browse Pets
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/ai-matcher">
                <Sparkles className="mr-2 h-4 w-4" /> AI Pet Matcher
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/user/favorites">
                <Heart className="mr-2 h-4 w-4" /> View Favorites
              </Link>
            </Button>
            <Button asChild className="w-full justify-start gradient-warm text-white">
              <Link href="/dashboard/user/applications">
                <FileText className="mr-2 h-4 w-4" /> My Applications
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden border-border/60 shadow-card">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-8 sm:flex-row">
          <div>
            <h3 className="text-lg font-semibold">Looking for your perfect match?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Let our AI analyze your preferences and find the ideal companion.
            </p>
          </div>
          <Button asChild size="lg" className="gradient-warm text-white">
            <Link href="/ai-matcher">
              Try AI Matcher <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
