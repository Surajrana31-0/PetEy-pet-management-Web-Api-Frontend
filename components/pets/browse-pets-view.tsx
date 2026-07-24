'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { PublicPetCard, ViewToggle } from '@/components/pets/public-pet-card';
import { PetQuickPreview } from '@/components/pets/pet-quick-preview';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FilterGroup, FilterSidebar } from '@/components/ui/filter-sidebar';
import { Pagination } from '@/components/ui/pagination';
import { SearchBar } from '@/components/ui/search-bar';
import { Select } from '@/components/ui/select';
import { CardSkeleton } from '@/components/ui/skeleton';
import { PET_SPECIES_LABELS, SORT_OPTIONS } from '@/lib/constants/pets';
import { useWishlist } from '@/lib/hooks/use-wishlist';
import { buildBrowseUrl } from '@/lib/utils/browse-params';
import { PetSize, PetSpecies, type IPet, type IPetCategories } from '@/lib/types/pet';

interface BrowsePetsViewProps {
  pets: IPet[];
  total: number;
  page: number;
  totalPages: number;
  categories: IPetCategories;
  error?: string | null;
}

export function BrowsePetsView({
  pets,
  total,
  page,
  totalPages,
  categories,
  error,
}: BrowsePetsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { toggle, isWishlisted, ready } = useWishlist();

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [previewPet, setPreviewPet] = useState<IPet | null>(null);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');

  const currentParams = {
    page: searchParams.get('page') ?? undefined,
    q: searchParams.get('q') ?? undefined,
    species: searchParams.get('species') ?? undefined,
    size: searchParams.get('size') ?? undefined,
    breed: searchParams.get('breed') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
  };

  const navigate = useCallback(
    (updates: Record<string, string | undefined>) => {
      const url = buildBrowseUrl(
        {
          ...currentParams,
          ...updates,
          page: updates.page ?? (updates.q !== undefined || updates.species !== undefined || updates.size !== undefined || updates.breed !== undefined || updates.sort !== undefined ? '1' : currentParams.page),
        },
        currentParams,
      );
      startTransition(() => router.push(url));
    },
    [currentParams, router],
  );

  useEffect(() => {
    setSearchInput(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get('q') ?? '';
      if (searchInput !== currentQ) {
        navigate({ q: searchInput || undefined, page: '1' });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, navigate, searchParams]);

  const resetFilters = () => {
    setSearchInput('');
    startTransition(() => router.push('/adopt'));
  };

  if (error) {
    return (
      <ErrorState
        title="Could not load pets"
        message={error}
        onRetry={() => router.refresh()}
      />
    );
  }

  return (
    <div className="browse-layout">
      <aside className={`browse-filters ${filtersOpen ? 'browse-filters--open' : ''}`}>
        <FilterSidebar
          onReset={resetFilters}
          isOpen={filtersOpen}
          onToggle={() => setFiltersOpen((v) => !v)}
        >
          <FilterGroup label="Species">
            <Select
              value={searchParams.get('species') ?? ''}
              onChange={(e) => navigate({ species: e.target.value || undefined })}
              aria-label="Filter by species"
            >
              <option value="">All species</option>
              {Object.values(PetSpecies).map((species) => (
                <option key={species} value={species}>
                  {PET_SPECIES_LABELS[species]}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup label="Size">
            <Select
              value={searchParams.get('size') ?? ''}
              onChange={(e) => navigate({ size: e.target.value || undefined })}
              aria-label="Filter by size"
            >
              <option value="">All sizes</option>
              {Object.values(PetSize).map((size) => (
                <option key={size} value={size}>
                  {size.charAt(0) + size.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </FilterGroup>

          {categories.breeds.length > 0 && (
            <FilterGroup label="Breed">
              <Select
                value={searchParams.get('breed') ?? ''}
                onChange={(e) => navigate({ breed: e.target.value || undefined })}
                aria-label="Filter by breed"
              >
                <option value="">All breeds</option>
                {categories.breeds.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </Select>
            </FilterGroup>
          )}
        </FilterSidebar>
      </aside>

      <div className="browse-main">
        <div className="browse-toolbar">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search by name, breed, or description..."
            className="max-w-none flex-1"
          />

          <div className="browse-toolbar-actions">
            <button
              type="button"
              className="browse-filter-toggle lg:hidden"
              onClick={() => setFiltersOpen((v) => !v)}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            <Select
              value={searchParams.get('sort') ?? 'newest'}
              onChange={(e) => navigate({ sort: e.target.value })}
              aria-label="Sort pets"
              className="w-40"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>

            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        <p className="browse-results-count" aria-live="polite">
          {isPending ? 'Updating results…' : `${total} ${total === 1 ? 'pet' : 'pets'} found`}
        </p>

        {isPending ? (
          <div className={view === 'grid' ? 'pets-grid' : 'browse-list'}>
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : pets.length === 0 ? (
          <EmptyState
            title="No pets match your search"
            description="Try adjusting your filters or search terms to discover more companions."
            actionLabel="Clear filters"
            onAction={resetFilters}
          />
        ) : (
          <div className={view === 'grid' ? 'pets-grid' : 'browse-list'}>
            {pets.map((pet, index) => (
              <PublicPetCard
                key={pet._id}
                pet={pet}
                index={index}
                view={view}
                isWishlisted={ready ? isWishlisted(pet._id) : false}
                onToggleWishlist={toggle}
                onQuickPreview={setPreviewPet}
              />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => navigate({ page: String(p) })}
          className="mt-8"
        />
      </div>

      <PetQuickPreview
        pet={previewPet}
        index={pets.findIndex((p) => p._id === previewPet?._id)}
        onClose={() => setPreviewPet(null)}
      />
    </div>
  );
}
