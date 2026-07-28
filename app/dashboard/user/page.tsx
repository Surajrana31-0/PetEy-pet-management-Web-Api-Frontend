import Link from 'next/link';
import { requireUserRole } from '@/lib/auth/guards';
import { petsApi } from '@/lib/api/pets';
import { adoptionsApi } from '@/lib/api/adoptions';
import { getMyAppointments } from '@/lib/api/appointments';
import { PetStatus } from '@/lib/types/pet';
import { Card, CardContent } from '@/components/ui/card';
import { Compass, FileText, Heart, Stethoscope, Sparkles, User, ShieldCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

export default async function UserDashboardPage() {
  const user = await requireUserRole();

  let availableCount = 0;
  let myApplicationsCount = 0;
  let myAppointmentsCount = 0;

  try {
    const [petsRes, adoptionsRes, appointmentsRes] = await Promise.all([
      petsApi.getAll(PetStatus.AVAILABLE),
      adoptionsApi.getMy(),
      getMyAppointments(),
    ]);

    if (petsRes.success && petsRes.data?.pets) {
      availableCount = petsRes.data.pets.length;
    }
    if (adoptionsRes.success && adoptionsRes.data) {
      const apps = Array.isArray(adoptionsRes.data) ? adoptionsRes.data : adoptionsRes.data.adoptions || [];
      myApplicationsCount = apps.length;
    }
    if (appointmentsRes.success && appointmentsRes.data) {
      const appts = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : appointmentsRes.data.appointments || [];
      myAppointmentsCount = appts.length;
    }
  } catch {
    // Graceful fallback
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Hero Welcome Banner */}
      <section className="dashboard-header">
        <div className="space-y-2 max-w-xl">
          <span className="hero-eyebrow">
            Adopter Workspace
          </span>
          <h1 className="dashboard-header-title">
            Welcome back, {user.fullName ? user.fullName.split(' ')[0] : 'User'}! 👋
          </h1>
          <p className="dashboard-header-desc">
            Track your adoption applications, schedule certified vet appointments, and discover your next pet companion.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[var(--border-light)] shadow-sm">
          <Avatar src={user.profileImage} name={user.fullName} size="lg" className="ring-2 ring-[var(--brand-primary)]" />
          <div>
            <span className="text-xs font-semibold text-[var(--text-muted)] block">Logged in as</span>
            <strong className="text-sm font-bold text-[var(--text-dark)] block">{user.fullName}</strong>
            <span className="text-[10px] text-[var(--brand-primary)] uppercase font-mono">{user.role}</span>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="metric-card">
          <div>
            <p className="metric-label">Available Pets</p>
            <h3 className="metric-value">{availableCount}</h3>
          </div>
          <div className="metric-icon-wrap">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        <Link href="/dashboard/user/adoptions" className="block">
          <div className="metric-card">
            <div>
              <p className="metric-label">My Applications</p>
              <h3 className="metric-value">{myApplicationsCount}</h3>
            </div>
            <div className="metric-icon-wrap">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/user/appointments" className="block">
          <div className="metric-card">
            <div>
              <p className="metric-label">Vet Appointments</p>
              <h3 className="metric-value">{myAppointmentsCount}</h3>
            </div>
            <div className="metric-icon-wrap">
              <Stethoscope className="w-6 h-6" />
            </div>
          </div>
        </Link>
      </section>

      {/* Quick Action Navigation Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--text-dark)]">Workspace Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/adopt"
            className="p-5 rounded-2xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md hover:border-[var(--brand-primary)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-dark)]">Browse Pets Catalogue</h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Explore available dogs, cats, and small animals ready for adoption.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 mt-4 inline-block">
              Browse Catalogue →
            </span>
          </Link>

          <Link
            href="/dashboard/user/adoptions"
            className="p-5 rounded-2xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md hover:border-[var(--brand-primary)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-dark)]">Track Applications</h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Check status updates, AI scores, and shelter notes on submitted forms.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-600 mt-4 inline-block">
              View {myApplicationsCount} Applications →
            </span>
          </Link>

          <Link
            href="/dashboard/user/favorites"
            className="p-5 rounded-2xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md hover:border-[var(--brand-primary)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-dark)]">Saved Wishlist</h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Review your saved pet profiles and prepare your applications.
              </p>
            </div>
            <span className="text-xs font-bold text-rose-600 mt-4 inline-block">
              View Favorites →
            </span>
          </Link>

          <Link
            href="/ai-assistant"
            className="p-5 rounded-2xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md hover:border-[var(--brand-primary)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-dark)]">AI Pet Assistant</h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Chat with GPT-4.1 for care recommendations and compatibility checks.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 mt-4 inline-block">
              Open AI Chat →
            </span>
          </Link>

          <Link
            href="/dashboard/profile"
            className="p-5 rounded-2xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md hover:border-[var(--brand-primary)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-dark)]">Edit Profile</h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Update your name, phone, address, and location details.
              </p>
            </div>
            <span className="text-xs font-bold text-sky-600 mt-4 inline-block">
              Manage Profile →
            </span>
          </Link>

          <Link
            href="/dashboard/settings"
            className="p-5 rounded-2xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md hover:border-[var(--brand-primary)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-dark)]">Account Security</h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Change your password and keep your account secure.
              </p>
            </div>
            <span className="text-xs font-bold text-violet-600 mt-4 inline-block">
              Change Password →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
