import type { IPetQueryParams, PetSortOption } from '../types/pet';
import { PetSize, PetSpecies, PetStatus } from '../types/pet';

export const BROWSE_PAGE_SIZE = 12;

export interface BrowseSearchParams {
  page?: string;
  q?: string;
  species?: string;
  size?: string;
  breed?: string;
  sort?: string;
}

export function parseBrowseParams(params: BrowseSearchParams): IPetQueryParams {
  const page = Math.max(1, Number(params.page) || 1);
  const sort = (params.sort as PetSortOption) || 'newest';
  const validSorts: PetSortOption[] = ['newest', 'name-asc', 'name-desc', 'age'];

  const query: IPetQueryParams = {
    page,
    limit: BROWSE_PAGE_SIZE,
    status: PetStatus.AVAILABLE,
    sort: validSorts.includes(sort) ? sort : 'newest',
  };

  if (params.q?.trim()) query.q = params.q.trim();

  if (params.species && Object.values(PetSpecies).includes(params.species as PetSpecies)) {
    query.species = params.species as PetSpecies;
  }

  if (params.size && Object.values(PetSize).includes(params.size as PetSize)) {
    query.size = params.size as PetSize;
  }

  if (params.breed?.trim()) query.breed = params.breed.trim();

  return query;
}

export function buildBrowseUrl(updates: Partial<BrowseSearchParams>, current?: BrowseSearchParams): string {
  const merged = { ...current, ...updates };
  const search = new URLSearchParams();

  if (merged.q) search.set('q', merged.q);
  if (merged.species) search.set('species', merged.species);
  if (merged.size) search.set('size', merged.size);
  if (merged.breed) search.set('breed', merged.breed);
  if (merged.sort && merged.sort !== 'newest') search.set('sort', merged.sort);
  if (merged.page && merged.page !== '1') search.set('page', merged.page);

  const qs = search.toString();
  return qs ? `/adopt?${qs}` : '/adopt';
}
