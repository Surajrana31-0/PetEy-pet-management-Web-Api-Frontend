import { useEffect, useState, useCallback } from 'react';
import { supabase, type Pet } from '@/lib/supabase';
import { Search, ChevronLeft, ChevronRight, Heart, PawPrint, Loader2 } from 'lucide-react';

const PAGE_SIZE = 8;

export function BrowsePets({ onAdopt }: { onAdopt: (pet: Pet) => void }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchPets = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('pets').select('*', { count: 'exact' }).eq('status', 'available').order('created_at', { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    if (search) { query = query.or(`name.ilike.%${search}%,breed.ilike.%${search}%,species.ilike.%${search}%`); }
    if (speciesFilter !== 'all') { query = query.eq('species', speciesFilter); }
    const { data, count, error } = await query;
    if (error) { console.error('Error fetching pets:', error.message); } else { setPets((data || []) as Pet[]); setTotal(count || 0); }
    setLoading(false);
  }, [page, search, speciesFilter]);

  useEffect(() => { fetchPets(); }, [fetchPets]);
  useEffect(() => { setPage(0); }, [search, speciesFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, breed, or species..." className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition" />
        </div>
        <select value={speciesFilter} onChange={(e) => setSpeciesFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition bg-white">
          <option value="all">All species</option><option value="Dog">Dog</option><option value="Cat">Cat</option><option value="Rabbit">Rabbit</option><option value="Bird">Bird</option><option value="Other">Other</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-4">{loading ? 'Loading...' : `${total} pet${total !== 1 ? 's' : ''} available`}</p>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-teal-600 animate-spin" /></div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 mb-4"><PawPrint className="w-8 h-8" /></div>
          <p className="text-gray-500">No pets found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {pets.map((pet) => <PetCard key={pet.id} pet={pet} onAdopt={onAdopt} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0 || loading} className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"><ChevronLeft className="w-5 h-5" /></button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i)} disabled={loading} className={`w-10 h-10 rounded-xl font-medium transition disabled:opacity-40 ${page === i ? 'bg-teal-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1 || loading} className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"><ChevronRight className="w-5 h-5" /></button>
        </div>
      )}
    </div>
  );
}

function PetCard({ pet, onAdopt }: { pet: Pet; onAdopt: (pet: Pet) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {pet.image_url ? (
          <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-300"><PawPrint className="w-12 h-12" /></div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-teal-700">Available</div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
          <button onClick={() => onAdopt(pet)} className="text-gray-400 hover:text-rose-500 transition" title="Adopt"><Heart className="w-5 h-5" /></button>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {pet.species && <Tag>{pet.species}</Tag>}
          {pet.breed && <Tag>{pet.breed}</Tag>}
          {pet.age && <Tag>{pet.age}</Tag>}
          {pet.gender && <Tag>{pet.gender}</Tag>}
        </div>
        {pet.description && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{pet.description}</p>}
        <button onClick={() => onAdopt(pet)} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-xl transition">Request adoption</button>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-lg">{children}</span>;
}
