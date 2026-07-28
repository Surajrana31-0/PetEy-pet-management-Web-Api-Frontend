import React from 'react';
import Link from 'next/link';
import { requireAdminRole } from '@/lib/auth/guards';
import { getAllUsers, getUserStats } from '@/lib/api/admin/users';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Users, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { AdminUserTable } from './_components/AdminUserTable';

export default async function AdminUsersPage() {
  const admin = await requireAdminRole();

  let users: any[] = [];
  let stats = { totalUsers: 0, adminUsers: 0, regularUsers: 0 };
  let error: string | null = null;

  try {
    const [usersRes, statsRes] = await Promise.all([
      getAllUsers(),
      getUserStats(),
    ]);

    if (usersRes.success && usersRes.data) {
      users = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users || [];
    }
    if (statsRes.success && statsRes.data) {
      stats = statsRes.data;
    }
  } catch (err: any) {
    error = err.message || 'Failed to load user directory';
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
            User Directory & Access Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage registered platform users, assign administrator privileges, and audit accounts.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Total Registered Users</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{users.length || stats.totalUsers}</h3>
        </Card>
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Adopters / Standard Users</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{users.filter(u => u.role !== 'admin').length}</h3>
        </Card>
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Administrators</p>
          <h3 className="text-2xl font-black text-rose-600 mt-1">{users.filter(u => u.role === 'admin').length}</h3>
        </Card>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <AdminUserTable initialUsers={users} currentAdminId={admin._id} />
    </div>
  );
}
