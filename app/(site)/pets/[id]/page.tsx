'use client';

import { use } from 'react';
import useSWR from 'swr';
import { ArrowLeft, Heart, Share2, Dog, Cat, Calendar, Tag, MessageCircle, Sparkles, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { petsApi } from '@/lib/api/pets';
import type { IPet } from '@/lib/types/pet';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/skeletons';
import { ErrorState } from '@/components/error-state';
import { toast } from 'sonner';

const fetcher = async (id: string) => {
  const res = await petsApi.getById(id);
  if (!res.success) throw new Error(res.message || 'Failed to load pet');
  return res.data as IPet;
};

export default function PetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: pet, error, isLoading } = useSWR(id, fetcher);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-10 w-32" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState title="Pet not found" message={error?.message || 'This pet may have been removed or is no longer available.'} />
        <div className="mt-6 text-center">
          <Button asChild variant="outline"><Link href="/pets"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Browse</Link></Button>
        </div>
      </div>
    );
  }

  const SpeciesIcon = pet.species === 'DOG' ? Dog : Cat;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground"><Link href="/pets"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Browse</Link></Button>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/10">
            <div className="flex h-full items-center justify-center"><span className="text-[10rem] animate-float">{pet.emoji || (pet.species === 'DOG' ? '🐶' : '🐱')}</span></div>
            <div className="absolute left-4 top-4"><StatusBadge status={pet.status} /></div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"><SpeciesIcon className="h-4 w-4" /> {pet.species}</span>
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-medium"><Tag className="h-4 w-4 text-muted-foreground" /> {pet.breed}</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{pet.name}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{pet.age}</p>
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Listed on</span><span className="font-medium">{new Date(pet.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
          </div>
          <div className="mt-6"><h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">About</h3><p className="mt-2 leading-relaxed text-foreground/90">{pet.description}</p></div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1 gradient-warm text-white" disabled={pet.status !== 'AVAILABLE'} onClick={() => toast.info('Sign in to start the adoption process')}><Heart className="mr-2 h-5 w-5" />{pet.status === 'AVAILABLE' ? 'Start Adoption' : 'Not Available'}</Button>
            <Button size="lg" variant="outline" onClick={() => toast.success('Pet details copied to clipboard!')}><Share2 className="mr-2 h-4 w-4" /> Share</Button>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-card/50 p-4 text-center"><Shield className="mx-auto h-5 w-5 text-success" /><p className="mt-2 text-xs text-muted-foreground">Verified Listing</p></div>
            <div className="rounded-xl border border-border bg-card/50 p-4 text-center"><Clock className="mx-auto h-5 w-5 text-warning" /><p className="mt-2 text-xs text-muted-foreground">Quick Process</p></div>
            <div className="rounded-xl border border-border bg-card/50 p-4 text-center"><Sparkles className="mx-auto h-5 w-5 text-primary" /><p className="mt-2 text-xs text-muted-foreground">AI Matched</p></div>
          </div>
        </div>
      </div>
      <Card className="mt-10 border-border/60 shadow-card"><CardContent className="p-8"><div className="flex items-start gap-4"><span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl gradient-warm text-white"><MessageCircle className="h-6 w-6" /></span><div><h2 className="text-lg font-semibold">Have questions about {pet.name}?</h2><p className="mt-1 text-sm text-muted-foreground">Our AI assistant can answer questions about {pet.name}&apos;s temperament, care needs, and whether they&apos;re a good fit for your lifestyle.</p><Button asChild className="mt-4" size="sm"><Link href="/ai-matcher"><Sparkles className="mr-2 h-4 w-4" /> Ask AI about {pet.name}</Link></Button></div></div></CardContent></Card>
    </div>
  );
}
