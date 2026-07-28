import { requireUserRole } from '@/lib/auth/guards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, FileText, Sparkles, MessageSquare, PawPrint, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const RECENT_ACTIVITIES = [
  { icon: Heart, label: 'Added Max to favorites', time: '2 hours ago', color: 'text-destructive' },
  { icon: FileText, label: 'Submitted adoption application for Luna', time: '1 day ago', color: 'text-warning' },
  { icon: Sparkles, label: 'AI recommended 3 new pets', time: '2 days ago', color: 'text-primary' },
  { icon: MessageSquare, label: 'Chat with AI assistant about breeds', time: '3 days ago', color: 'text-accent' },
];

const QUICK_STATS = [
  { label: 'Favorite Pets', value: '5', icon: Heart, color: 'bg-destructive/10 text-destructive' },
  { label: 'Applications', value: '2', icon: FileText, color: 'bg-warning/10 text-warning' },
  { label: 'AI Matches', value: '8', icon: Sparkles, color: 'bg-primary/10 text-primary' },
  { label: 'Chat Sessions', value: '12', icon: MessageSquare, color: 'bg-accent/10 text-accent' },
];

export default async function UserDashboardPage() {
  const user = await requireUserRole();

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
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_ACTIVITIES.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-muted ${activity.color}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.label}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
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
