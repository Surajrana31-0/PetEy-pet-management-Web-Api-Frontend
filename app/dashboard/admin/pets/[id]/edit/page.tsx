import PetForm from '@/app/_components/PetForm';
import { requireAdminRole } from '@/lib/auth/guards';
import { petsApi } from '@/lib/api/pets';
import { notFound } from 'next/navigation';

interface EditPetPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPetPage({ params }: EditPetPageProps) {
  await requireAdminRole();
  const { id } = await params;

  let pet = null;
  try {
    const response = await petsApi.getById(id);
    pet = response.success ? response.data : null;
  } catch {
    pet = null;
  }

  if (!pet) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Edit Pet</h1>
        <p className="text-slate-500 text-sm mt-1">Update details for {pet.name}.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <PetForm mode="edit" pet={pet} />
      </div>
    </div>
  );
}
