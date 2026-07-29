import { requireAdminRole } from '@/lib/auth/guards';
import { getAllAdminPets } from '@/lib/api/admin/pets';
import { AdminPetsTable } from './_components/AdminPetsTable';
import type { Pet } from '@/lib/types';
import { PawPrint } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function AdminPetsPage() {
  await requireAdminRole();

  let pets: Pet[] = [];
  let error: string | null = null;

  try {
    const res = await getAllAdminPets({ limit: 100 });
    if (res.success && res.data) {
      const data = res.data;
      if (Array.isArray(data)) {
        pets = data as Pet[];
      } else {
        pets = ((data as unknown) as { pets: Pet[] }).pets ?? [];
      }
    } else {
      error = res.message || 'Failed to load pets';
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load pets';
  }

  if (error && pets.length === 0) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Pet Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create, edit, and manage pet listings.</p>
        </div>
        <EmptyState
          icon={PawPrint}
          title="Unable to load pets"
          description={error}
          action={
            <Button asChild className="gradient-warm text-white">
              <Link href="/dashboard/admin/pets/new"><Plus className="mr-2 h-4 w-4" /> Add Pet</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return <AdminPetsTable initialPets={pets} />;
}
