'use client';

import { use } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PetForm } from '@/components/pet-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/skeletons';
import { ErrorState } from '@/components/error-state';
import { petsApi } from '@/lib/api/pets';
import type { Pet } from '@/lib/types';
import { updatePetAction } from '@/lib/actions/pet-actions';

const fetcher = async (id: string) => {
  const res = await petsApi.getById(id);
  if (res.error) throw new Error(res.error);
  return res.data as Pet;
};

export default function EditPetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: pet, error, isLoading } = useSWR(id, fetcher);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
          <Link href="/dashboard/admin/pets"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Pets</Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Edit Pet</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update pet listing information.</p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {error && !isLoading && <ErrorState message={error.message} />}

      {!isLoading && !error && pet && (
        <PetForm
          mode="edit"
          pet={pet}
          onSubmit={async (formData) => {
            return await updatePetAction({ error: null, success: false }, formData);
          }}
        />
      )}
    </div>
  );
}
