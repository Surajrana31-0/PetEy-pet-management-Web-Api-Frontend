import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, PawPrint } from 'lucide-react';
import PetCard from '@/components/PetCard';
import { fetchPets, fetchFavoritePetIds, addFavorite, removeFavorite } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Pet } from '@/types';
import { cn } from '@/lib/utils';

const SPECIES_OPTIONS = [
  { value: '', label: 'All Pets' },
  { value: 'DOG', label: 'Dogs' },
  { value: 'CAT', label: 'Cats' },
];

const SIZE_OPTIONS = [
  { value: '', label: 'Any Size' },
  { value: 'SMALL', label: 'Small' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LARGE', label: 'Large' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ADOPTED', label: 'Adopted' },
];

export default function BrowsePetsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [pets, setPets] = useState<Pet[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const [filters, setFilters] = useState({
    species: searchParams.get('species') ?? '',
    size: '',
    status: searchParams.get('status') ?? 'AVAILABLE',
    gender: '',
    goodWithKids: false,
    goodWithPets: false,
    search: searchParams.get('search') ?? '',
  });

  const loadFavorites = useCallback(async () => {
    if (!user) return;
    try {
      const ids = await fetchFavoritePetIds();
      setFavoriteIds(ids);
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const loadPets = useCallback(async () => {
    setLoading(true);
    try {
      const { pets: data, total: count } = await fetchPets({
        species: filters.species || undefined,
        size: filters.size || undefined,
        status: filters.status || undefined,
        gender: filters.gender || undefined,
        goodWithKids: filters.goodWithKids || undefined,
        goodWithPets: filters.goodWithPets || undefined,
        search: filters.search || undefined,
        page,
        limit: 12,
      });
      setPets(data);
      setTotal(count);
      setTotalPages(Math.ceil(count / 12));
    } catch (err) {
      console.error('Failed to fetch pets:', err);
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  function updateFilter(key: string, value: string | boolean) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({
      species: '',
      size: '',
      status: 'AVAILABLE',
      gender: '',
      goodWithKids: false,
      goodWithPets: false,
      search: '',
    });
    setSearchParams({});
  }

  async function handleToggleFavorite(petId: string) {
    if (!user) return;
    try {
      if (favoriteIds.includes(petId)) {
        await removeFavorite(petId);
        setFavoriteIds((prev) => prev.filter((id) => id !== petId));
      } else {
        await addFavorite(petId);
        setFavoriteIds((prev) => [...prev, petId]);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  }

  return (
    <div className="animate-fade-in bg-stone-50 min-h-screen">
      <div className="container-app section-padding py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Browse Pets
          </h1>
          <p className="mt-2 text-stone-600">
            {total} {total === 1 ? 'pet' : 'pets'} available for adoption
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search by name, breed, or description..."
              className="input-field pl-11"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2 lg:hidden"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filters Sidebar */}
          <aside className={cn('space-y-6', showFilters ? 'block' : 'hidden lg:block')}>
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stone-900">Filters</h3>
                <button onClick={clearFilters} className="text-xs font-medium text-teal-600 hover:text-teal-700">
                  Clear All
                </button>
              </div>

              <div className="mt-4 space-y-5">
                {/* Species */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">Species</label>
                  <div className="space-y-1.5">
                    {SPECIES_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateFilter('species', opt.value)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                          filters.species === opt.value
                            ? 'bg-teal-50 text-teal-700 font-medium'
                            : 'text-stone-600 hover:bg-stone-100'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">Size</label>
                  <select
                    value={filters.size}
                    onChange={(e) => updateFilter('size', e.target.value)}
                    className="input-field"
                  >
                    {SIZE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => updateFilter('status', e.target.value)}
                    className="input-field"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">Gender</label>
                  <div className="flex gap-2">
                    {[{ v: '', l: 'Any' }, { v: 'MALE', l: 'Male' }, { v: 'FEMALE', l: 'Female' }].map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => updateFilter('gender', opt.v)}
                        className={cn(
                          'flex-1 rounded-lg px-3 py-2 text-sm transition-colors',
                          filters.gender === opt.v
                            ? 'bg-teal-50 text-teal-700 font-medium ring-1 ring-teal-200'
                            : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                        )}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lifestyle */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-700">Lifestyle</label>
                  <label className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.goodWithKids}
                      onChange={(e) => updateFilter('goodWithKids', e.target.checked)}
                      className="h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500"
                    />
                    Good with kids
                  </label>
                  <label className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.goodWithPets}
                      onChange={(e) => updateFilter('goodWithPets', e.target.checked)}
                      className="h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500"
                    />
                    Good with other pets
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Pet Grid */}
          <div>
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="card animate-pulse overflow-hidden">
                    <div className="aspect-[4/3] bg-stone-200" />
                    <div className="space-y-3 p-5">
                      <div className="h-5 w-32 rounded bg-stone-200" />
                      <div className="h-4 w-24 rounded bg-stone-200" />
                      <div className="flex gap-2">
                        <div className="h-6 w-16 rounded-full bg-stone-200" />
                        <div className="h-6 w-16 rounded-full bg-stone-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : pets.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-20">
                <PawPrint className="h-12 w-12 text-stone-300" />
                <h3 className="mt-4 text-lg font-semibold text-stone-700">No pets found</h3>
                <p className="mt-1 text-sm text-stone-500">Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="mt-4 btn-secondary">
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {pets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    isFavorited={favoriteIds.includes(pet.id)}
                    onToggleFavorite={user ? handleToggleFavorite : undefined}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary px-4 py-2 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-stone-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary px-4 py-2 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
