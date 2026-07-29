import { useEffect, useState, useCallback } from 'react';
import { supabase, type Pet } from '@/lib/supabase';
import { Loader2, PawPrint, Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 8;

export function ManagePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState<Pet | null>(null);
  const [showForm, setShowForm] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchPets = useCallback(async () => {
    setLoading(true);
    const { data, count, error } = await supabase.from('pets').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    if (error) { console.error(error.message); } else { setPets((data || []) as Pet[]); setTotal(count || 0); }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchPets(); }, [fetchPets]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this pet? This cannot be undone.')) return;
    const { error } = await supabase.from('pets').delete().eq('id', id);
    if (error) { alert(error.message); } else { fetchPets(); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{total} total pets</p>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2.5 rounded-xl transition flex items-center gap-2"><Plus className="w-5 h-5" /> Add pet</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-600 animate-spin" /></div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20"><div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 mb-4"><PawPrint className="w-8 h-8" /></div><p className="text-gray-500">No pets yet. Add your first pet!</p></div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="h-44 overflow-hidden bg-gray-100">{pet.image_url ? <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><PawPrint className="w-10 h-10" /></div>}</div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div><p className="font-semibold text-gray-900">{pet.name}</p><p className="text-sm text-gray-500">{pet.species} {pet.breed && `· ${pet.breed}`}</p></div>
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${pet.status === 'available' ? 'bg-teal-100 text-teal-700' : pet.status === 'adopted' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'}`}>{pet.status}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => { setEditing(pet); setShowForm(true); }} className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 rounded-lg transition flex items-center justify-center gap-1.5"><Pencil className="w-4 h-4" /> Edit</button>
                    <button onClick={() => handleDelete(pet.id)} className="border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium py-2 px-3 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"><ChevronLeft className="w-5 h-5" /></button>
              {Array.from({ length: totalPages }, (_, i) => (<button key={i} onClick={() => setPage(i)} className={`w-10 h-10 rounded-xl font-medium transition ${page === i ? 'bg-teal-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>{i + 1}</button>))}
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"><ChevronRight className="w-5 h-5" /></button>
            </div>
          )}
        </>
      )}
      {showForm && <PetForm pet={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchPets(); }} />}
    </div>
  );
}

function PetForm({ pet, onClose, onSaved }: { pet: Pet | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: pet?.name || '', species: pet?.species || 'Dog', breed: pet?.breed || '', age: pet?.age || '', gender: pet?.gender || '', description: pet?.description || '', image_url: pet?.image_url || '', status: (pet?.status || 'available') as 'available' | 'adopted' | 'pending',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setLoading(true);
    setError('');
    if (!form.name || !form.species) { setError('Name and species are required'); setLoading(false); return; }
    const payload = { ...form };
    let result;
    if (pet) { result = await supabase.from('pets').update(payload).eq('id', pet.id); } else { result = await supabase.from('pets').insert(payload); }
    if (result.error) { setError(result.error.message); } else { onSaved(); }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">{pet ? 'Edit pet' : 'Add new pet'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Pet name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition" placeholder="Buddy" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Species *</label><select value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none transition bg-white"><option>Dog</option><option>Cat</option><option>Rabbit</option><option>Bird</option><option>Other</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Breed</label><input value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none transition" placeholder="Golden Retriever" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label><input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none transition" placeholder="2 years" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label><select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none transition bg-white"><option value="">Unknown</option><option>Male</option><option>Female</option></select></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none transition" placeholder="https://..." /><p className="text-xs text-gray-400 mt-1">Paste a direct image link. This is the photo users will see when browsing pets.</p></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none transition resize-none" placeholder="A friendly and playful dog..." /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'available' | 'adopted' | 'pending' })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none transition bg-white"><option value="available">Available</option><option value="pending">Pending</option><option value="adopted">Adopted</option></select></div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60">{loading && <Loader2 className="w-5 h-5 animate-spin" />}{pet ? 'Save changes' : 'Add pet'}</button>
        </div>
      </div>
    </div>
  );
}
