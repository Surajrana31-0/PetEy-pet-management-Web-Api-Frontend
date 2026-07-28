import PetForm from '@/app/_components/PetForm';
import { requireAdminRole } from '@/lib/auth/guards';

export default async function NewPetPage() {
  await requireAdminRole();

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-8">
      <header className="dashboard-header">
        <div className="space-y-2">
          <span className="hero-eyebrow">Database Entry</span>
          <h1 className="dashboard-header-title">Add New Pet</h1>
          <p className="dashboard-header-desc">
            Create a new pet listing for adoption with detailed information.
          </p>
        </div>
      </header>

      <div className="bg-white border border-[var(--border-light)] shadow-sm rounded-2xl p-6 sm:p-8">
        <PetForm mode="create" />
      </div>
    </div>
  );
}
