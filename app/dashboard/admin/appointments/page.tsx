import Link from 'next/link';
import { requireAdminRole } from '@/lib/auth/guards';
import {
  getAllAdminAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentStatistics,
} from '@/lib/api/admin/appointment';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Stethoscope, AlertCircle } from 'lucide-react';

const STATUS_COLORS: Record<string, 'warning' | 'success' | 'destructive' | 'secondary'> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  CANCELLED: 'destructive',
  COMPLETED: 'secondary',
};

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requireAdminRole();
  const params = await searchParams;
  const status = params.status;
  const page = Number(params.page) || 1;

  let appointments: any[] = [];
  let stats: Record<string, number> | null = null;
  let error: string | null = null;
  let totalPages = 1;

  try {
    const [appointmentsRes, statsRes] = await Promise.all([
      getAllAdminAppointments({ page, limit: 10, status }),
      getAppointmentStatistics().catch(() => null),
    ]);
    if (appointmentsRes.success && appointmentsRes.data) {
      const data = appointmentsRes.data as any;
      appointments = data.appointments ?? data;
      totalPages = data.pagination?.pages ?? 1;
    }
    if (statsRes?.success && statsRes.data) {
      stats = statsRes.data as Record<string, number>;
    }
  } catch (err: any) {
    error = err.message || 'Failed to load appointments';
  }

  const statusFilters = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Vet Appointments</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage all veterinarian appointment requests.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pending', value: stats.pending ?? 0, color: 'text-amber-600 bg-amber-50' },
            { label: 'Confirmed', value: stats.confirmed ?? 0, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Completed', value: stats.completed ?? 0, color: 'text-blue-600 bg-blue-50' },
            { label: 'Cancelled', value: stats.cancelled ?? 0, color: 'text-rose-600 bg-rose-50' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border border-slate-200 p-4 ${s.color}`}>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/admin/appointments"
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            !status ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All
        </Link>
        {statusFilters.map((s) => (
          <Link
            key={s}
            href={`/dashboard/admin/appointments?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              status === s ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {appointments.length === 0 ? (
        <Card className="border border-slate-200/80 bg-white/50 text-center py-16 px-4">
          <CardContent className="space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto text-2xl">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold">No Appointments Found</h3>
            <p className="text-xs text-slate-500">
              {status ? `No ${status.toLowerCase()} appointments at this time.` : 'No appointments have been booked yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((app) => {
            const vet = app.veterinarianId || {};
            const user = app.userId || {};
            return (
              <Card key={app._id} className="border border-slate-200/80 bg-white dark:bg-slate-900 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center">
                        {vet.name ? vet.name.charAt(0) : 'V'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold">Dr. {vet.name || 'Unknown'}</h4>
                          <Badge variant={STATUS_COLORS[app.status] || 'secondary'}>{app.status}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-teal-500" />
                            {new Date(app.appointmentDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-teal-500" />
                            {app.timeSlot}
                          </span>
                        </p>
                        <p className="text-xs mt-1 font-mono">
                          Pet: {app.petName} ({app.petSpecies}) — Reason: {app.reason}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">Booked by: {user.fullName || 'Unknown user'}</p>
                      </div>
                    </div>

                    {app.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <form
                          action={async () => {
                            'use server';
                            await updateAppointmentStatus(app._id, { status: 'CONFIRMED' });
                          }}
                        >
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                          >
                            Confirm
                          </button>
                        </form>
                        <form
                          action={async () => {
                            'use server';
                            await updateAppointmentStatus(app._id, { status: 'CANCELLED', cancellationReason: 'Cancelled by admin' });
                          }}
                        >
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </form>
                      </div>
                    )}

                    {app.status === 'CONFIRMED' && (
                      <div className="flex gap-2">
                        <form
                          action={async () => {
                            'use server';
                            await updateAppointmentStatus(app._id, { status: 'COMPLETED' });
                          }}
                        >
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                          >
                            Mark Completed
                          </button>
                        </form>
                      </div>
                    )}

                    {(app.status === 'CANCELLED' || app.status === 'COMPLETED') && (
                      <form
                        action={async () => {
                          'use server';
                          await deleteAppointment(app._id);
                        }}
                      >
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
                        >
                          Delete
                        </button>
                      </form>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/dashboard/admin/appointments?page=${p}${status ? `&status=${status}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                p === page ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
