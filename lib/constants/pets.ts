import { HOME_IMAGES } from './home-images';
import { PetSpecies } from '../types/pet';

export const PET_SPECIES_LABELS: Record<PetSpecies, string> = {
  [PetSpecies.DOG]: 'Dogs',
  [PetSpecies.CAT]: 'Cats',
  [PetSpecies.BIRD]: 'Birds',
  [PetSpecies.RABBIT]: 'Rabbits',
  [PetSpecies.OTHER]: 'Other Pets',
};

export const PET_SPECIES_EMOJI: Record<PetSpecies, string> = {
  [PetSpecies.DOG]: '🐕',
  [PetSpecies.CAT]: '🐈',
  [PetSpecies.BIRD]: '🐦',
  [PetSpecies.RABBIT]: '🐇',
  [PetSpecies.OTHER]: '🐾',
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
  {
    species: PetSpecies.BIRD,
    label: 'Birds',
    description: 'Colorful, cheerful household companions',
    image: 'https://images.unsplash.com/photo-1552728080-b8d46e1db60e?auto=format&fit=crop&w=600&h=450&q=80',
  },
  {
    species: PetSpecies.RABBIT,
    label: 'Rabbits',
    description: 'Gentle, quiet pets for calm homes',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&h=450&q=80',
  },
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'name-desc', label: 'Name (Z–A)' },
  { value: 'age', label: 'Age' },
] as const;

export const WISHLIST_STORAGE_KEY = 'petey_wishlist';
