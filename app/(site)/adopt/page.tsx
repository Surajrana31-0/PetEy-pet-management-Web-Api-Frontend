import { Suspense } from 'react';
import AnimateIn from '@/app/_components/AnimateIn';
import { BrowsePetsView } from '@/components/pets/browse-pets-view';
import { CardSkeleton } from '@/components/ui/skeleton';
import { petsApi } from '@/lib/api/pets';
import { BROWSE_PAGE_SIZE, parseBrowseParams, type BrowseSearchParams } from '@/lib/utils/browse-params';
import type { IPet, IPetCategories } from '@/lib/types/pet';

function BrowseFallback() {
  return (
    <div className="browse-layout">
      <div className="browse-main">
        <div className="pets-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

async function BrowseContent({ searchParams }: { searchParams: BrowseSearchParams }) {
  const query = parseBrowseParams(searchParams);
  let pets: IPet[] = [];
  let total = 0;
  let page = query.page ?? 1;
  let error: string | null = null;
  let categories: IPetCategories = { species: [], breeds: [], sizes: [] };

  try {
    const [petsResponse, categoriesResponse] = await Promise.all([
      petsApi.getAll(query),
      petsApi.getCategories(),
    ]);

    if (petsResponse.success && petsResponse.data) {
      pets = petsResponse.data.pets;
      total = petsResponse.data.total;
      page = petsResponse.data.page;
    } else {
      error = petsResponse.message || 'Failed to load pets';
    }

    if (categoriesResponse.success && categoriesResponse.data) {
      categories = categoriesResponse.data;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load pets';
  }

  const totalPages = Math.max(1, Math.ceil(total / BROWSE_PAGE_SIZE));

  return (
    <BrowsePetsView
      pets={pets}
      total={total}
      page={page}
      totalPages={totalPages}
      categories={categories}
      error={error}
    />
  );
}

export default async function AdoptPage({
  searchParams,
}: {
  searchParams: Promise<BrowseSearchParams>;
}) {
  const params = await searchParams;

  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container">
          <AnimateIn immediate>
            <span className="hero-eyebrow">Find your match</span>
            <h1 className="page-hero-title">Browse Available Pets</h1>
            <p className="page-hero-desc">
              Search, filter, and discover loving companions waiting for their forever homes.
              Save favorites to your wishlist and preview profiles before you apply.
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="section-white section-white--compact">
        <div className="container">
          <Suspense fallback={<BrowseFallback />}>
            <BrowseContent searchParams={params} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
