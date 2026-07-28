import React from 'react';
import Link from 'next/link';
import { requireUserRole } from '@/lib/auth/guards';
import { getMyAppointments } from '@/lib/api/appointments';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Stethoscope, AlertCircle } from 'lucide-react';

export default async function UserAppointmentsPage() {
  const user = await requireUserRole();

  let appointments: any[] = [];
  let error: string | null = null;

  try {
    const res = await getMyAppointments();
    if (res.success && res.data) {
      appointments = Array.isArray(res.data) ? res.data : res.data.appointments || [];
    }
  } catch (err: any) {
    error = err.message || 'Failed to load appointments';
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/user"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            My Vet Appointments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            View scheduled consultations, pet checkups, and vaccination history.
          </p>
        </div>
        <Link
          href="/vets"
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
        >
          <Stethoscope className="w-4 h-4" />
          Book Consultation
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {appointments.length === 0 ? (
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-center py-16 px-4">
          <CardContent className="space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center mx-auto text-2xl">
              🩺
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Appointments Scheduled</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You don't have any upcoming veterinary appointments. Browse our certified vet directory to schedule a checkup.
            </p>
            <Link
              href="/vets"
              className="inline-block px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-md"
            >
              Browse Certified Vets
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((app) => {
            const vet = app.veterinarianId || {};
            return (
              <Card key={app._id} className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-base">
                      {vet.name ? vet.name.charAt(0) : 'V'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {vet.name || 'Veterinary Consultation'}
                        </h4>
                        <Badge variant={app.status === 'confirmed' ? 'success' : app.status === 'cancelled' ? 'destructive' : 'warning'}>
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-teal-500" /> {new Date(app.appointmentDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-teal-500" /> {app.timeSlot}</span>
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-mono">
                        Pet: {app.petName} ({app.petSpecies}) — Reason: {app.reason}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
