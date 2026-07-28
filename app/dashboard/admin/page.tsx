import { requireAdminRole } from '@/lib/auth/guards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint, Check, Clock, Users, TrendingUp, Sparkles, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const STATS = [
  { label: 'Total Pets', value: '24', icon: PawPrint, color: 'bg-primary/10 text-primary', change: '+3 this week' },
  { label: 'Available', value: '18', icon: Check, color: 'bg-success/10 text-success', change: '75% of total' },
  { label: 'Pending Adoptions', value: '4', icon: Clock, color: 'bg-warning/10 text-warning', change: '2 new today' },
  { label: 'Completed', value: '12', icon: TrendingUp, color: 'bg-accent/10 text-accent', change: '+2 this month' },
  { label: 'Total Users', value: '156', icon: Users, color: 'bg-primary/10 text-primary', change: '+12 this week' },
  { label: 'AI Usage', value: '340', icon: Sparkles, color: 'bg-accent/10 text-accent', change: '+45 today' },
];

const RECENT_APPLICATIONS = [
  { petName: 'Max', applicant: 'Sarah Johnson', date: 'Jan 20, 2026', status: 'PENDING' },
  { petName: 'Luna', applicant: 'Michael Chen', date: 'Jan 19, 2026', status: 'PENDING' },
  { petName: 'Buddy', applicant: 'Emily Davis', date: 'Jan 18, 2026', status: 'APPROVED' },
  { petName: 'Whiskers', applicant: 'John Smith', date: 'Jan 17, 2026', status: 'REJECTED' },
];

const QUICK_ACTIONS = [
  { label: 'Add New Pet', href: '/dashboard/admin/pets/new', icon: PawPrint },
  { label: 'View Applications', href: '/dashboard/admin/applications', icon: FileText },
  { label: 'Analytics', href: '/dashboard/admin/analytics', icon: TrendingUp },
];

export default async function AdminDashboardPage() {
  await requireAdminRole();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform overview and recent activity.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border/60 shadow-card transition-all hover:shadow-glow">
              <CardContent className="p-4">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-3 text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="mt-1 text-xs font-medium text-success">{stat.change}</div>
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
                <FileText className="h-5 w-5 text-primary" /> Recent Applications
              </span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/admin/applications">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RECENT_APPLICATIONS.map((app, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-xl">
                      {app.petName === 'Max' ? '🐶' : app.petName === 'Luna' ? '🐱' : app.petName === 'Buddy' ? '🐶' : '🐱'}
                    </span>
                    <div>
                      <div className="text-sm font-medium">{app.petName}</div>
                      <div className="text-xs text-muted-foreground">{app.applicant} · {app.date}</div>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    app.status === 'PENDING' ? 'bg-warning/15 text-warning' :
                    app.status === 'APPROVED' ? 'bg-success/15 text-success' :
                    'bg-destructive/15 text-destructive'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
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
    </div>
  );
}
