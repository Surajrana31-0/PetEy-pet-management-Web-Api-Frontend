import React from 'react';
import Link from 'next/link';
import { requireAdminRole } from '@/lib/auth/guards';
import { getAdminVets, getAdminVetStats } from '@/lib/api/admin/vets';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Stethoscope, AlertCircle } from 'lucide-react';
import { AdminVetTable } from './_components/AdminVetTable';

export default async function AdminVetsPage() {
  const admin = await requireAdminRole();

  let vets: any[] = [];
  let stats: Record<string, number> = { totalVets: 0, activeVets: 0 };
  let error: string | null = null;

  try {
    const [vetsRes, statsRes] = await Promise.all([
      getAdminVets(),
      getAdminVetStats(),
    ]);

    if (vetsRes.success && vetsRes.data) {
      vets = Array.isArray(vetsRes.data) ? vetsRes.data : [];
    }
    if (statsRes.success && statsRes.data) {
      stats = statsRes.data as Record<string, number>;
    }
  } catch (err: any) {
    error = err.message || 'Failed to load veterinarian directory';
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Center
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Veterinarian Directory Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Register certified veterinary doctors, manage consultation schedules, and toggle active status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Total Registered Vets</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{vets.length || stats.totalVets}</h3>
        </Card>
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Active Consultation Providers</p>
          <h3 className="text-2xl font-black text-teal-600 mt-1">{vets.filter((v) => v.isActive).length}</h3>
        </Card>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <AdminVetTable initialVets={vets} />
    </div>
  );
}
