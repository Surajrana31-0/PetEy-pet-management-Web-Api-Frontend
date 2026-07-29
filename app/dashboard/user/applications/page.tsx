import Link from 'next/link';
import { FileText, Clock, CheckCircle2, XCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { requireUserRole } from '@/lib/auth/guards';
import { adoptionsApi } from '@/lib/api/adoptions';

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  PENDING: { label: 'Pending Review', className: 'bg-warning/15 text-warning border-warning/30', icon: Clock },
  APPROVED: { label: 'Approved', className: 'bg-success/15 text-success border-success/30', icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', className: 'bg-destructive/15 text-destructive border-destructive/30', icon: XCircle },
  COMPLETED: { label: 'Completed', className: 'bg-success/15 text-success border-success/30', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', className: 'bg-muted text-muted-foreground border-border', icon: XCircle },
};

export default async function ApplicationsPage() {
  const user = await requireUserRole();
  let applications: any[] = [];
  let error: string | null = null;

  try {
    const res = await adoptionsApi.getMy();
    if (res.success && res.data) {
      applications = Array.isArray(res.data) ? res.data : [];
    }
  } catch (err: any) {
    error = err.message || 'Failed to load applications';
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Adoption Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track the status of your adoption applications.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Start the adoption process for a pet you love, and track its progress here."
          action={
            <Button asChild className="gradient-warm text-white">
              <Link href="/dashboard/user/browse">Browse Pets</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const pet = app.petId || {};
            const status = app.status || 'PENDING';
            const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
            const Icon = config.icon;
            const petImage = pet.image
              ? pet.image.startsWith('http')
                ? pet.image
                : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') ?? ''}${pet.image}`
              : null;

            return (
              <Card key={app._id} className="border-border/60 shadow-card transition-all hover:shadow-glow">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {petImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={petImage} alt={pet.name} className="h-14 w-14 rounded-2xl object-cover" />
                    ) : (
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-3xl">
                        🐾
                      </span>
                    )}
                    <div>
                      <h3 className="font-semibold">{pet.name || 'Unknown Pet'}</h3>
                      <p className="text-sm text-muted-foreground">{pet.breed}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Applied on{' '}
                        {new Date(app.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {app.aiMatchScore != null && (
                      <div className="text-center">
                        <div className="text-2xl font-bold gradient-warm bg-clip-text text-transparent">
                          {app.aiMatchScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">Match</div>
                      </div>
                    )}
                    <Badge variant="outline" className={`gap-1.5 ${config.className}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {config.label}
                    </Badge>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/dashboard/user/adoptions">
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
