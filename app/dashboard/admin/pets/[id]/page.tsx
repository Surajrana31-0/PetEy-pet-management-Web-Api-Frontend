import { requireAdminRole } from '@/lib/auth/guards';
import { prepareServerRequest } from '@/lib/auth/server-request';
import { getAdminPetById } from '@/lib/api/admin/pets';
import Link from 'next/link';
import { ArrowLeft, Pencil, Heart, Share2, Dog, Cat, Calendar, Tag, Shield, Clock, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ErrorState } from '@/components/error-state';
import { StatusBadge } from '@/components/status-badge';
import type { IPet } from '@/lib/types/pet';

export default async function AdminPetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdminRole();
  await prepareServerRequest();

  let pet: IPet | null = null;
  let error: string | null = null;

  try {
    const res = await getAdminPetById(id);
    if (res.success && res.data) {
      pet = res.data as IPet;
    } else {
      error = res.message || 'Failed to load pet';
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load pet';
  }

  if (error && !pet) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState title="Pet not found" message={error} />
        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/pets"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Pets</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!pet) return null;

  const SpeciesIcon = pet.species === 'DOG' ? Dog : Cat;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
          <Link href="/dashboard/admin/pets"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Pets</Link>
        </Button>
        <Button asChild className="gradient-warm text-white">
          <Link href={`/dashboard/admin/pets/${pet._id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit Pet</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/10">
            <div className="flex h-full items-center justify-center">
              <span className="text-[10rem] animate-float">{pet.emoji || (pet.species === 'DOG' ? '🐶' : '🐱')}</span>
            </div>
            <div className="absolute left-4 top-4">
              <StatusBadge status={pet.status ?? 'AVAILABLE'} />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <SpeciesIcon className="h-4 w-4" /> {pet.species}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-medium">
              <Tag className="h-4 w-4 text-muted-foreground" /> {pet.breed}
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight">{pet.name}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{pet.age} years old</p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Listed on</span>
              <span className="font-medium">
                {new Date(pet.createdAt ?? Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">About</h3>
            <p className="mt-2 leading-relaxed text-foreground/90">{pet.description}</p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-card/50 p-4 text-center">
              <Shield className="mx-auto h-5 w-5 text-success" />
              <p className="mt-2 text-xs text-muted-foreground">Verified Listing</p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 p-4 text-center">
              <Clock className="mx-auto h-5 w-5 text-warning" />
              <p className="mt-2 text-xs text-muted-foreground">Quick Process</p>
            </div>
            <div className="rounded-xl border border-border bg-card/50 p-4 text-center">
              <Sparkles className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 text-xs text-muted-foreground">AI Matched</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="mt-10 border-border/60 shadow-card">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl gradient-warm text-white">
              <MessageCircle className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Manage this listing</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Update pet details, change status, or remove this listing from the platform.
              </p>
              <div className="mt-4 flex gap-3">
                <Button asChild size="sm" className="gradient-warm text-white">
                  <Link href={`/dashboard/admin/pets/${pet._id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
