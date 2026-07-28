import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PetForm } from '@/components/pet-form';
import { Button } from '@/components/ui/button';
import { createPetAction } from '@/lib/actions/pet-actions';

export default function CreatePetPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
          <Link href="/dashboard/admin/pets"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Pets</Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Add New Pet</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a new pet listing for adoption.</p>
      </div>

      <PetForm
        mode="create"
        onSubmit={async (formData) => {
          return await createPetAction({ error: null, success: false }, formData);
        }}
      />
    </div>
  );
}
