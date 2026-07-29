import { requireAdminRole } from '@/lib/auth/guards';
import { prepareServerRequest } from '@/lib/auth/server-request';
import { getAdminPetById } from '@/lib/api/admin/pets';
import PetForm from '@/app/_components/PetForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/error-state';
import type { IPet } from '@/lib/types/pet';

export default async function EditPetPage({ params }: { params: Promise<{ id: string }> }) {
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

      {error && !pet && <ErrorState message={error} />}
      {pet && <PetForm mode="edit" pet={pet} />}
    </div>
  );
}
