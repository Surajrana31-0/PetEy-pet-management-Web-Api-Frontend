import Link from 'next/link';
import { requireUserRole } from '@/lib/auth/guards';
import { petsApi } from '@/lib/api/pets';
import { PetStatus } from '@/lib/types/pet';

export default async function UserDashboardPage() {
  const user = await requireUserRole();
  const initial = user.fullName.charAt(0).toUpperCase();

  let availableCount = 0;
  try {
    const response = await petsApi.getAll(PetStatus.AVAILABLE);
    availableCount = response.success && response.data ? response.data.length : 0;
  } catch {
    availableCount = 0;
  }

  return (
    <div className="dash-page">
      <section className="dash-hero">
        <div className="dash-hero-inner">
          <div className="dash-hero-text">
            <span className="dash-badge dash-badge--user">Adopter Account</span>
            <h1>Welcome back, {user.fullName.split(' ')[0]}!</h1>
            <p>
              Your journey to finding a loving companion starts here. Browse available pets
              and start your adoption process today.
            </p>
          </div>
          <div className="dash-hero-avatar" aria-hidden>{initial}</div>
        </div>
      </section>

      <section className="dash-stats">
        <div className="dash-stat">
          <p className="dash-stat-label">Pets Available</p>
          <p className="dash-stat-value dash-stat-value--accent">{availableCount}</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-label">My Applications</p>
          <p className="dash-stat-value">0</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-label">Account Status</p>
          <p className="dash-stat-value" style={{ fontSize: 20 }}>Active</p>
        </div>
      </section>

      <section>
        <h2 className="dash-section-title">Quick Actions</h2>
        <div className="dash-grid">
          <Link href="/dashboard/user/browse" className="dash-card dash-card--link">
            <div className="dash-card-icon">🔍</div>
            <p className="dash-card-title">Browse Pets</p>
            <p className="dash-card-desc">
              Explore {availableCount} pets currently available for adoption.
            </p>
            <span className="dash-card-cta">Start browsing →</span>
          </Link>

          <div className="dash-card">
            <div className="dash-card-icon">📋</div>
            <p className="dash-card-title">My Applications</p>
            <p className="dash-card-desc">Track your adoption requests and their status.</p>
            <span className="dash-card-cta" style={{ color: '#9a9a9a' }}>Coming soon</span>
          </div>

          <div className="dash-card">
            <div className="dash-card-icon">❤️</div>
            <p className="dash-card-title">Saved Pets</p>
            <p className="dash-card-desc">Keep a list of pets you are interested in adopting.</p>
            <span className="dash-card-cta" style={{ color: '#9a9a9a' }}>Coming soon</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="dash-section-title">My Profile</h2>
        <div className="dash-profile-card">
          <div className="dash-profile-row">
            <span className="dash-profile-key">Full Name</span>
            <span className="dash-profile-val">{user.fullName}</span>
          </div>
          <div className="dash-profile-row">
            <span className="dash-profile-key">Email</span>
            <span className="dash-profile-val">{user.email}</span>
          </div>
          <div className="dash-profile-row">
            <span className="dash-profile-key">Role</span>
            <span className="dash-profile-val">{user.role}</span>
          </div>
          <div className="dash-profile-row">
            <span className="dash-profile-key">Member Since</span>
            <span className="dash-profile-val">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
