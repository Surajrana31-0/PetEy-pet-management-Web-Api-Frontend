import { HOME_IMAGES } from '../constants/home-images';
import { PetSpecies } from '../types/pet';
import type { IPet } from '../types/pet';

const speciesFallbacks: Record<PetSpecies, string> = {
  [PetSpecies.DOG]: HOME_IMAGES.petDefaults.DOG,
  [PetSpecies.CAT]: HOME_IMAGES.petDefaults.CAT,
};

export function getPetImage(
  pet: Pick<IPet, 'species' | 'images' | '_id'>,
  index = 0,
): string {
  if (pet.images && pet.images.length > 0) {
    return pet.images[index % pet.images.length] ?? speciesFallbacks[pet.species] ?? HOME_IMAGES.fallback;
  }

  if (pet.species === PetSpecies.DOG || pet.species === PetSpecies.CAT) {
    return HOME_IMAGES.featured[index % HOME_IMAGES.featured.length] ?? speciesFallbacks[pet.species];
  }

  return HOME_IMAGES.fallback;
}

export function getPetImageUrl(pet: Pick<IPet, 'species' | 'images'>): string {
  if (pet.images && pet.images.length > 0) return pet.images[0] ?? HOME_IMAGES.fallback;
  return speciesFallbacks[pet.species] ?? HOME_IMAGES.fallback;
}
