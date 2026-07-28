import { FileText, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const APPLICATIONS = [
  {
    petName: 'Max',
    breed: 'Golden Retriever',
    status: 'PENDING',
    date: 'Jan 15, 2026',
    compatibility: 92,
  },
  {
    petName: 'Luna',
    breed: 'Tabby Cat',
    status: 'PENDING',
    date: 'Jan 10, 2026',
    compatibility: 87,
  },
];

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  PENDING: { label: 'Pending Review', className: 'bg-warning/15 text-warning border-warning/30', icon: Clock },
  APPROVED: { label: 'Approved', className: 'bg-success/15 text-success border-success/30', icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', className: 'bg-destructive/15 text-destructive border-destructive/30', icon: XCircle },
};

export default function ApplicationsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Adoption Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track the status of your adoption applications.</p>
      </div>

      {APPLICATIONS.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Start the adoption process for a pet you love, and track its progress here."
          action={
            <Button asChild className="gradient-warm text-white">
              <Link href="/pets">Browse Pets</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {APPLICATIONS.map((app) => {
            const config = STATUS_CONFIG[app.status];
            const Icon = config.icon;
            return (
              <Card key={app.petName} className="border-border/60 shadow-card transition-all hover:shadow-glow">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-3xl">
                      {app.petName === 'Max' ? '🐶' : '🐱'}
                    </span>
                    <div>
                      <h3 className="font-semibold">{app.petName}</h3>
                      <p className="text-sm text-muted-foreground">{app.breed}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Applied on {app.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-warm bg-clip-text text-transparent">{app.compatibility}%</div>
                      <div className="text-xs text-muted-foreground">Match</div>
                    </div>
                    <Badge variant="outline" className={`gap-1.5 ${config.className}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {config.label}
                    </Badge>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/dashboard/user/applications">
                        Details <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
