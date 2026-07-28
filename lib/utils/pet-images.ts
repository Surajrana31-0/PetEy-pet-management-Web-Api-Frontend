import { HOME_IMAGES } from '../constants/home-images';
import { PetSpecies } from '../types/pet';
import type { IPet } from '../types/pet';

const speciesFallbacks: Record<PetSpecies, string> = {
  [PetSpecies.DOG]: HOME_IMAGES.petDefaults.DOG,
  [PetSpecies.CAT]: HOME_IMAGES.petDefaults.CAT,
  [PetSpecies.BIRD]:
    'https://images.unsplash.com/photo-1552728080-b8d46e1db60e?auto=format&fit=crop&w=600&h=450&q=80',
  [PetSpecies.RABBIT]:
    'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&h=450&q=80',
  [PetSpecies.OTHER]: HOME_IMAGES.fallback,
};

export function getPetImage(
  pet: Pick<IPet, 'species' | 'imageUrl' | '_id'>,
  index = 0,
): string {
  if (pet.imageUrl) return pet.imageUrl;

  if (pet.species === PetSpecies.DOG || pet.species === PetSpecies.CAT) {
    return HOME_IMAGES.featured[index % HOME_IMAGES.featured.length] ?? speciesFallbacks[pet.species];
  }

  return speciesFallbacks[pet.species] ?? HOME_IMAGES.fallback;
}

export function getPetImageUrl(pet: Pick<IPet, 'species' | 'imageUrl'>): string {
  return pet.imageUrl ?? speciesFallbacks[pet.species] ?? HOME_IMAGES.fallback;
}
