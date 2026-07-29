import Link from 'next/link';
import { requireUserRole } from '@/lib/auth/guards';
import { adoptionsApi } from '@/lib/api/adoptions';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { UserAdoptionTable } from './_components/UserAdoptionTable';

export default async function UserAdoptionsPage() {
  await requireUserRole();
  let applications: any[] = [];
  let stats: Record<string, number> = { total: 0, pending: 0, approved: 0, rejected: 0 };
  let error: string | null = null;

  try {
    const [myRes, statsRes] = await Promise.all([adoptionsApi.getMy(), adoptionsApi.getStats()]);
    if (myRes.success && myRes.data) applications = Array.isArray(myRes.data) ? myRes.data : [];
    if (statsRes.success && statsRes.data) stats = statsRes.data as Record<string, number>;
  } catch (err: any) {
    error = err.message || 'Failed to load applications';
  }

  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <Link
          href="/dashboard/user"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Adoption Applications</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track the status of your submitted adoption applications.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 p-4">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Pending</p>
          <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</h3>
        </Card>
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 p-4">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Total</p>
          <h3 className="text-2xl font-black mt-1">{stats.total || applications.length}</h3>
        </Card>
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 p-4">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Approved</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats.approved || 0}</h3>
        </Card>
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 p-4">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Rejected</p>
          <h3 className="text-2xl font-black text-rose-600 mt-1">{stats.rejected || 0}</h3>
        </Card>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <UserAdoptionTable initialApplications={applications} />
    </div>
  );
}
