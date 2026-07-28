import Link from 'next/link';
import { requireAdminRole } from '@/lib/auth/guards';
import { petsApi } from '@/lib/api/pets';
import { adoptionsApi } from '@/lib/api/adoptions';
import { getAllUsers } from '@/lib/api/admin/users';
import { PetStatus } from '@/lib/types/pet';
import { Card, CardContent } from '@/components/ui/card';
import { PawPrint, FileText, Users, Stethoscope, BookOpen, Plus, ShieldCheck, ArrowRight } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

export default async function AdminDashboardPage() {
  const admin = await requireAdminRole();

  let petsCount = 0;
  let availableCount = 0;
  let pendingAdoptionsCount = 0;
  let totalUsersCount = 0;

  try {
    const [petsRes, pendingRes, usersRes] = await Promise.all([
      petsApi.getAll(),
      adoptionsApi.getPending(),
      getAllUsers(),
    ]);

    if (petsRes.success && petsRes.data?.pets) {
      petsCount = petsRes.data.pets.length;
      availableCount = petsRes.data.pets.filter((p: any) => p.status === PetStatus.AVAILABLE).length;
    }
    if (pendingRes.success && pendingRes.data) {
      const apps = Array.isArray(pendingRes.data) ? pendingRes.data : pendingRes.data.adoptions || [];
      pendingAdoptionsCount = apps.length;
    }
    if (usersRes.success && usersRes.data) {
      const users = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users || [];
      totalUsersCount = users.length;
    }
  } catch {
    // Fallback
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Admin Control Banner */}
      <section className="dashboard-header">
        <div className="space-y-2 max-w-xl">
          <span className="hero-eyebrow">
            System Command Center
          </span>
          <h1 className="dashboard-header-title">
            Welcome, Administrator {admin.fullName ? admin.fullName.split(' ')[0] : 'User'}
          </h1>
          <p className="dashboard-header-desc">
            Manage pet listings, review applicant questionnaires, supervise registered doctors, and administer system users.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[var(--border-light)] shadow-sm">
          <Avatar src={admin.profileImage} name={admin.fullName} size="lg" className="ring-2 ring-[var(--brand-primary)]" />
          <div className="flex-1">
            <span className="text-xs font-semibold text-[var(--text-muted)] block">System Administrator</span>
            <strong className="text-sm font-bold text-[var(--text-dark)] block">{admin.fullName}</strong>
            <span className="text-[10px] text-[var(--brand-primary)] uppercase font-mono font-bold">SUPERADMIN</span>
          </div>
          <Link
            href="/dashboard/profile"
            className="text-xs font-semibold text-[var(--brand-primary)] bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/admin/pets" className="block">
          <div className="metric-card">
            <div>
              <p className="metric-label">Total Pets</p>
              <h3 className="metric-value">{petsCount}</h3>
              <span className="text-[11px] font-semibold text-emerald-600">{availableCount} Available</span>
            </div>
            <div className="metric-icon-wrap">
              <PawPrint className="w-6 h-6" />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/admin/adoptions" className="block">
          <div className="metric-card">
            <div>
              <p className="metric-label">Pending Review</p>
              <h3 className="metric-value">{pendingAdoptionsCount}</h3>
              <span className="text-[11px] text-[var(--text-muted)]">Applications</span>
            </div>
            <div className="metric-icon-wrap">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/admin/users" className="block">
          <div className="metric-card">
            <div>
              <p className="metric-label">Total Users</p>
              <h3 className="metric-value">{totalUsersCount}</h3>
              <span className="text-[11px] text-[var(--text-muted)]">Registered Accounts</span>
            </div>
            <div className="metric-icon-wrap">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/admin/vets" className="block">
          <div className="metric-card">
            <div>
              <p className="metric-label">Veterinarians</p>
              <h3 className="metric-value">View</h3>
              <span className="text-[11px] text-[var(--brand-primary)] font-semibold">Active Providers</span>
            </div>
            <div className="metric-icon-wrap">
              <Stethoscope className="w-6 h-6" />
            </div>
          </div>
        </Link>
      </section>

      {/* Admin Modules Navigation */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--text-dark)]">Admin Control Center Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/dashboard/admin/adoptions"
            className="p-6 rounded-2xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md hover:border-[var(--brand-primary)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[var(--text-dark)]">Adoption Review Queue</h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Inspect applicant questionnaire submissions, check AI compatibility scores, approve or reject applications.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-600 mt-6 inline-flex items-center gap-1">
              <span>Review {pendingAdoptionsCount} Pending Requests</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/dashboard/admin/pets/new"
            className="p-6 rounded-2xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md hover:border-[var(--brand-primary)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[var(--text-dark)]">Add New Pet Listing</h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Create new pet profiles with multi-photo upload and AI description auto-generator.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 mt-6 inline-flex items-center gap-1">
              <span>Create Pet Profile</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/dashboard/admin/users"
            className="p-6 rounded-2xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md hover:border-[var(--brand-primary)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[var(--text-dark)]">User Directory & RBAC</h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                View all registered accounts, modify user roles between USER and ADMIN, manage credentials.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 mt-6 inline-flex items-center gap-1">
              <span>Manage {totalUsersCount} Users</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/dashboard/admin/vets"
            className="p-6 rounded-2xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md hover:border-[var(--brand-primary)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[var(--text-dark)]">Veterinarians Directory</h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Manage registered certified doctors, specializations, consultation fees, and active availability.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-600 mt-6 inline-flex items-center gap-1">
              <span>Manage Vets</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/dashboard/admin/blogs"
            className="p-6 rounded-2xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md hover:border-[var(--brand-primary)] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Blog & Articles Publisher</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Write pet care stories, publish announcements, and manage draft articles.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-6 inline-flex items-center gap-1">
              <span>Manage Blog Articles</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
