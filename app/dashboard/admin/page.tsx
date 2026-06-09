import Link from 'next/link';
import { requireAdminRole } from '@/lib/auth/guards';
import { petsApi } from '@/lib/api/pets';
import type { IPet } from '@/lib/types/pet';
import { PetStatus } from '@/lib/types/pet';

function statusClass(status: PetStatus): string {
  if (status === PetStatus.AVAILABLE) return 'dash-status--available';
  if (status === PetStatus.PENDING) return 'dash-status--pending';
  return 'dash-status--adopted';
}

export default async function AdminDashboardPage() {
  const admin = await requireAdminRole();
  const initial = admin.fullName.charAt(0).toUpperCase();

  let pets: IPet[] = [];
  try {
    const response = await petsApi.getAll();
    pets = response.success && response.data ? response.data : [];
  } catch {
    pets = [];
  }

  const available = pets.filter((p) => p.status === PetStatus.AVAILABLE).length;
  const adopted = pets.filter((p) => p.status === PetStatus.ADOPTED).length;
  const recent = pets.slice(0, 5);

  return (
    <div className="dash-page">
      <section className="dash-hero">
        <div className="dash-hero-inner">
          <div className="dash-hero-text">
            <span className="dash-badge dash-badge--admin">Administrator</span>
            <h1>Admin Control Panel</h1>
            <p>
              Welcome, {admin.fullName}. Manage pet listings, monitor adoption activity,
              and keep the platform running smoothly.
            </p>
          </div>
          <div className="dash-hero-avatar" aria-hidden>{initial}</div>
        </div>
      </section>

      <section className="dash-stats">
        <div className="dash-stat">
          <p className="dash-stat-label">Total Pets</p>
          <p className="dash-stat-value">{pets.length}</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-label">Available</p>
          <p className="dash-stat-value dash-stat-value--accent">{available}</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-label">Adopted</p>
          <p className="dash-stat-value">{adopted}</p>
        </div>
      </section>

      <section>
        <h2 className="dash-section-title">Quick Actions</h2>
        <div className="dash-grid">
          <Link href="/dashboard/admin/pets/new" className="dash-card dash-card--link">
            <div className="dash-card-icon">➕</div>
            <p className="dash-card-title">Add New Pet</p>
            <p className="dash-card-desc">Create a new pet listing for adoption.</p>
            <span className="dash-card-cta">Create listing →</span>
          </Link>

          <Link href="/dashboard/admin/pets" className="dash-card dash-card--link">
            <div className="dash-card-icon">🐾</div>
            <p className="dash-card-title">Manage Pets</p>
            <p className="dash-card-desc">View, edit, or remove existing pet listings.</p>
            <span className="dash-card-cta">Go to table →</span>
          </Link>

          <div className="dash-card">
            <div className="dash-card-icon">📬</div>
            <p className="dash-card-title">Adoption Requests</p>
            <p className="dash-card-desc">Review and approve user adoption applications.</p>
            <span className="dash-card-cta" style={{ color: '#9a9a9a' }}>Coming soon</span>
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section>
          <div className="dash-page-header">
            <div>
              <h2 className="dash-section-title" style={{ marginBottom: 0 }}>Recent Listings</h2>
              <p>Latest pets added to the platform</p>
            </div>
            <Link href="/dashboard/admin/pets" className="dash-btn-sm">View all</Link>
          </div>
          <div className="dash-table-wrap" style={{ marginTop: 16 }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Species</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((pet) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
