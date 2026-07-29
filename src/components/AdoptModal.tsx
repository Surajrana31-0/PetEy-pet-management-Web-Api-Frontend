import { useState } from 'react';
import { supabase, type Pet } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { X, Loader2, PawPrint, CheckCircle2 } from 'lucide-react';

export function AdoptModal({ pet, onClose }: { pet: Pet; onClose: () => void }) {
  const { session } = useAuth();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setLoading(true);
    setError('');
    const { error } = await supabase.from('adoptions').insert({ pet_id: pet.id, user_id: session!.user.id, notes, status: 'pending' });
    if (error) { setError(error.message); } else { setSuccess(true); }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-100 text-teal-600 mb-4"><CheckCircle2 className="w-8 h-8" /></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Request submitted!</h2>
            <p className="text-gray-500 mb-6">Your adoption request for {pet.name} has been submitted. You can track its status in your dashboard.</p>
            <button onClick={onClose} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-xl transition">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Adopt {pet.name}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                  {pet.image_url ? <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><PawPrint className="w-6 h-6" /></div>}
                </div>
                <div><p className="font-medium text-gray-900">{pet.name}</p><p className="text-sm text-gray-500">{pet.species} {pet.breed && `· ${pet.breed}`}</p></div>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Tell us why you'd be a great owner..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition resize-none" />
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mt-3">{error}</div>}
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-xl transition mt-4 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}Submit request
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
