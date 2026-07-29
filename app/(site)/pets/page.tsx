'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { Search, SlidersHorizontal, LayoutGrid, List, X, PawPrint } from 'lucide-react';
import { petsApi } from '@/lib/api/pets';
import type { Pet, PetSpecies, PetStatus } from '@/lib/types';
import { PetCard } from '@/components/pet-card';
import { PetGridSkeleton } from '@/components/skeletons';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const fetcher = async () => {
  const res = await petsApi.list({ limit: 100 });
  if (!res.success) throw new Error(res.message || 'Failed to load pets');
  const data = res.data;
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as { pets?: Pet[] }).pets)) return (data as { pets: Pet[] }).pets;
  return [];
};

type SortOption = 'newest' | 'name' | 'breed';

export default function BrowsePetsPage() {
  const { data: pets, error, isLoading, mutate } = useSWR<Pet[]>('pets', fetcher);
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<PetSpecies | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<PetStatus | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    if (!pets) return [];
    let result = [...pets];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (speciesFilter !== 'ALL') result = result.filter((p) => p.species === speciesFilter);
    if (statusFilter !== 'ALL') result = result.filter((p) => p.status === statusFilter);
    switch (sortBy) {
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'breed': result.sort((a, b) => a.breed.localeCompare(b.name)); break;
      default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  }, [pets, search, speciesFilter, statusFilter, sortBy]);

  const hasActiveFilters = search || speciesFilter !== 'ALL' || statusFilter !== 'ALL';
  const clearFilters = () => { setSearch(''); setSpeciesFilter('ALL'); setStatusFilter('ALL'); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8"><h1 className="text-3xl font-bold tracking-tight">Browse Pets</h1><p className="mt-1 text-muted-foreground">{pets ? `${filtered.length} of ${pets.length} pets` : 'Loading pets…'}</p></div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" placeholder="Search by name, breed, or description…" className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search pets" /></div>
        <div className="flex items-center gap-2">
          <Select value={speciesFilter} onValueChange={(v) => setSpeciesFilter(v as PetSpecies | 'ALL')}><SelectTrigger className="w-[130px]" aria-label="Filter by species"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">All Species</SelectItem><SelectItem value="DOG">Dogs</SelectItem><SelectItem value="CAT">Cats</SelectItem></SelectContent></Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PetStatus | 'ALL')}><SelectTrigger className="w-[140px]" aria-label="Filter by status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">All Status</SelectItem><SelectItem value="AVAILABLE">Available</SelectItem><SelectItem value="PENDING">Pending</SelectItem><SelectItem value="ADOPTED">Adopted</SelectItem></SelectContent></Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}><SelectTrigger className="w-[130px]" aria-label="Sort pets"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest</SelectItem><SelectItem value="name">Name A-Z</SelectItem><SelectItem value="breed">Breed A-Z</SelectItem></SelectContent></Select>
          <div className="hidden items-center rounded-lg border border-border sm:flex">
            <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className={cn('rounded-r-none', viewMode === 'grid' && 'gradient-warm text-white')} onClick={() => setViewMode('grid')} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></Button>
            <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" className={cn('rounded-l-none', viewMode === 'list' && 'gradient-warm text-white')} onClick={() => setViewMode('list')} aria-label="List view"><List className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
      {hasActiveFilters && (
        <div className="mb-4 flex items-center gap-2"><Badge variant="secondary" className="gap-1"><SlidersHorizontal className="h-3 w-3" /> Filters active</Badge><Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs"><X className="mr-1 h-3 w-3" /> Clear all</Button></div>
      )}
      {isLoading && <PetGridSkeleton count={8} />}
      {error && !isLoading && <ErrorState message={error.message} onRetry={() => mutate()} />}
      {!isLoading && !error && filtered.length === 0 && (
        <EmptyState icon={PawPrint} title={hasActiveFilters ? 'No pets match your filters' : 'No pets available yet'} description={hasActiveFilters ? 'Try adjusting your search or filters.' : 'Check back soon — new pets are added regularly!'} action={hasActiveFilters ? <Button onClick={clearFilters} variant="outline">Clear filters</Button> : undefined} />
      )}
      {!isLoading && !error && filtered.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((pet) => <PetCard key={pet._id} pet={pet} />)}</div>
          ) : (
            <div className="flex flex-col gap-3">{filtered.map((pet) => <PetCard key={pet._id} pet={pet} className="flex-row" />)}</div>
          )}
        </>
      )}
    </div>
  );
}
