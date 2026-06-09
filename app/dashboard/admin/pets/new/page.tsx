import PetForm from '@/app/_components/PetForm';
import { requireAdminRole } from '@/lib/auth/guards';

export default async function NewPetPage() {
  await requireAdminRole();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Add New Pet</h1>
        <p className="text-slate-500 text-sm mt-1">Create a new pet listing for adoption.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <PetForm mode="create" />
      </div>
    </div>
  );
}
