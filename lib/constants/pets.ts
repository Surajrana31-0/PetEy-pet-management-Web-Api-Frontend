import { HOME_IMAGES } from './home-images';
import { PetSpecies } from '../types/pet';

export const PET_SPECIES_LABELS: Record<PetSpecies, string> = {
  [PetSpecies.DOG]: 'Dogs',
  [PetSpecies.CAT]: 'Cats',
};

export const PET_SPECIES_EMOJI: Record<PetSpecies, string> = {
  [PetSpecies.DOG]: '🐕',
  [PetSpecies.CAT]: '🐈',
};

export const CATEGORY_CARDS = [
  {
    species: PetSpecies.DOG,
    label: 'Dogs',
    description: 'Loyal companions ready for adventure',
    image: HOME_IMAGES.featured[0],
  },
  {
    species: PetSpecies.CAT,
    label: 'Cats',
    description: 'Independent friends with big personalities',
    image: HOME_IMAGES.featured[1],
  },
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'name-desc', label: 'Name (Z–A)' },
  { value: 'age', label: 'Age' },
] as const;

export const WISHLIST_STORAGE_KEY = 'petey_wishlist';
