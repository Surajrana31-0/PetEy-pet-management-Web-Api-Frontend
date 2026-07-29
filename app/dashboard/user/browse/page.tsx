import PetCard from '@/app/_components/PetCard';
import { requireUserRole } from '@/lib/auth/guards';
import { petsApi } from '@/lib/api/pets';
import type { IPet } from '@/lib/types/pet';
import { PetStatus } from '@/lib/types/pet';

export default async function UserBrowsePetsPage() {
  await requireUserRole();
  let pets: IPet[] = [];
  try {
    const response = await petsApi.getAll({ status: PetStatus.AVAILABLE });
    pets = response.success && response.data?.pets ? response.data.pets : [];
  } catch { pets = []; }
  return (
    <div className="dash-page">
      <div className="dash-page-header"><div><h1>Browse Available Pets</h1><p>{pets.length > 0 ? `${pets.length} loving ${pets.length === 1 ? 'companion is' : 'companions are'} waiting for a forever home.` : 'Check back soon — new pets are added regularly.'}</p></div></div>
      {pets.length === 0 ? (
        <div className="dash-empty"><div className="dash-empty-icon">🐾</div><p className="dash-empty-title">No pets available right now</p><p className="dash-empty-desc">Our team is updating listings. Please visit again soon.</p></div>
      ) : (
        <div className="dash-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>{pets.map((pet) => <PetCard key={pet._id} pet={pet} />)}</div>
      )}
    </div>
  );
}
