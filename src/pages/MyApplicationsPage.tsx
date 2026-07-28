import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, PawPrint, Clock, CheckCircle2, XCircle, X, Calendar } from 'lucide-react';
import { fetchMyApplications } from '@/lib/api';
import type { AdoptionApplication } from '@/types';
import { ADOPTION_STATUS_LABELS, ADOPTION_STATUS_COLORS, SPECIES_EMOJI } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    try {
      const data = await fetchMyApplications();
      setApplications(data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = filter === 'all' ? applications : applications.filter((a) => a.status === filter);

  const statusIcons: Record<string, typeof Clock> = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
    completed: CheckCircle2,
    cancelled: X,
  };

  return (
    <div className="animate-fade-in bg-stone-50 min-h-screen">
      <div className="container-app section-padding py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
            My Applications
          </h1>
          <p className="mt-1 text-stone-600">Track the status of your adoption applications.</p>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                'rounded-xl px-4 py-2 text-sm font-medium transition-all capitalize',
                filter === status
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
              )}
            >
              {status === 'all' ? 'All' : ADOPTION_STATUS_LABELS[status as keyof typeof ADOPTION_STATUS_LABELS]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-teal-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-20">
            <FileText className="h-12 w-12 text-stone-300" />
            <h3 className="mt-4 text-lg font-semibold text-stone-700">No applications yet</h3>
            <p className="mt-1 text-sm text-stone-500">Start an adoption application from any pet's page.</p>
            <Link to="/pets" className="mt-6 btn-primary">
              <PawPrint className="h-5 w-5" />
              Browse Pets
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => {
              const StatusIcon = statusIcons[app.status] ?? Clock;
              return (
                <div key={app.id} className="card p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Pet Info */}
                    <Link to={`/pets/${app.pet_id}`} className="flex items-center gap-4 sm:w-64">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                        {app.pet?.images?.[0] ? (
                          <img src={app.pet.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-3xl">
                            {app.pet ? SPECIES_EMOJI[app.pet.species] : '🐾'}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900">{app.pet?.name ?? 'Unknown Pet'}</p>
                        <p className="text-sm text-stone-500">{app.pet?.breed}</p>
                      </div>
                    </Link>

                    {/* Status & Date */}
                    <div className="flex flex-1 items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className={cn('badge', ADOPTION_STATUS_COLORS[app.status])}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {ADOPTION_STATUS_LABELS[app.status]}
                        </span>
                        {app.ai_match_score !== null && (
                          <span className="text-xs text-stone-500">
                            AI Match: {Math.round(Number(app.ai_match_score))}%
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-stone-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(app.submitted_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {app.admin_notes && (
                    <div className="mt-4 rounded-xl bg-stone-50 p-3 text-sm text-stone-600">
                      <span className="font-medium text-stone-700">Admin note: </span>
                      {app.admin_notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
