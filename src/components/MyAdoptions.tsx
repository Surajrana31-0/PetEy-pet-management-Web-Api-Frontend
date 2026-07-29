import { useEffect, useState } from 'react';
import { supabase, type Adoption } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Loader2, PawPrint, Clock, CheckCircle2, XCircle } from 'lucide-react';

export function MyAdoptions() {
  const { session } = useAuth();
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('adoptions').select('*, pet:pets(*)').eq('user_id', session!.user.id).order('created_at', { ascending: false });
      if (error) { console.error(error.message); } else { setAdoptions((data || []) as Adoption[]); }
      setLoading(false);
    }
    load();
  }, [session]);

  if (loading) { return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-600 animate-spin" /></div>; }
  if (adoptions.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 mb-4"><PawPrint className="w-8 h-8" /></div>
        <p className="text-gray-500">No adoption requests yet. Browse pets to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {adoptions.map((adoption) => (
        <div key={adoption.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {adoption.pet?.image_url ? <img src={adoption.pet.image_url} alt={adoption.pet.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><PawPrint className="w-7 h-7" /></div>}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{adoption.pet?.name || 'Unknown pet'}</p>
            <p className="text-sm text-gray-500">{adoption.pet?.species} {adoption.pet?.breed && `· ${adoption.pet.breed}`}</p>
            {adoption.notes && <p className="text-sm text-gray-400 mt-1 truncate">{adoption.notes}</p>}
          </div>
          <StatusBadge status={adoption.status} />
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { icon: Clock, text: 'Pending', className: 'bg-amber-100 text-amber-700' },
    approved: { icon: CheckCircle2, text: 'Approved', className: 'bg-teal-100 text-teal-700' },
    rejected: { icon: XCircle, text: 'Rejected', className: 'bg-red-100 text-red-700' },
  };
  const c = config[status as keyof typeof config] || config.pending;
  return <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${c.className}`}><c.icon className="w-4 h-4" />{c.text}</div>;
}
