import Link from 'next/link';
import { deletePetFormAction } from '@/lib/actions/pet-actions';
import { requireAdminRole } from '@/lib/auth/guards';
import { petsApi } from '@/lib/api/pets';
import type { IPet } from '@/lib/types/pet';
import { PetStatus } from '@/lib/types/pet';

function statusClass(status: PetStatus): string {
  if (status === PetStatus.AVAILABLE) return 'dash-status--available';
  if (status === PetStatus.PENDING) return 'dash-status--pending';
  return 'dash-status--adopted';
}

export default async function AdminPetsPage() {
  await requireAdminRole();

  let pets: IPet[] = [];
  try {
    const response = await petsApi.getAll();
    pets = response.success && response.data?.pets ? response.data.pets : [];
  } catch {
    pets = [];
  }

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <div>
          <h1>Pet Management</h1>
          <p>Create, update, and remove pet listings from the platform.</p>
        </div>
        <Link href="/dashboard/admin/pets/new" className="btn-primary">
          + Add New Pet
        </Link>
      </div>

      {pets.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">🐕</div>
          <p className="dash-empty-title">No pets listed yet</p>
          <p className="dash-empty-desc">Create your first pet listing to get started.</p>
          <Link href="/dashboard/admin/pets/new" className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
            Add First Pet
          </Link>
        </div>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Pet</th>
                <th>Species</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet._id}>
                  <td>
                    <div className="dash-pet-cell">
                      <div className="dash-pet-emoji">{pet.emoji}</div>
                      <div>
                        <p className="dash-pet-name">{pet.name}</p>
                        <p className="dash-pet-meta">{pet.breed} • {pet.age}</p>
                      </div>
                    </div>
                  </td>
                  <td>{pet.species}</td>
                  <td>
                    <span className={`dash-status ${statusClass(pet.status)}`}>
                      {pet.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <Link
                        href={`/dashboard/admin/pets/${pet._id}/edit`}
                        className="dash-btn-sm"
                      >
                        Edit
                      </Link>
                      <form action={deletePetFormAction.bind(null, pet._id)}>
                        <button type="submit" className="dash-btn-sm dash-btn-sm--danger">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
