import type { PetStatus, PetSpecies, PetSize, PetGender, ActivityLevel, AdoptionStatus } from '@/types';

export const SPECIES_LABELS: Record<PetSpecies, string> = {
  DOG: 'Dogs',
  CAT: 'Cats',
};

export const SPECIES_EMOJI: Record<PetSpecies, string> = {
  DOG: '🐕',
  CAT: '🐱',
};

export const STATUS_LABELS: Record<PetStatus, string> = {
  AVAILABLE: 'Available',
  PENDING: 'Pending',
  ADOPTED: 'Adopted',
};

export const STATUS_COLORS: Record<PetStatus, string> = {
  AVAILABLE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  ADOPTED: 'bg-sky-100 text-sky-700 border-sky-200',
};

export const SIZE_LABELS: Record<PetSize, string> = {
  SMALL: 'Small',
  MEDIUM: 'Medium',
  LARGE: 'Large',
};

export const GENDER_LABELS: Record<PetGender, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const ADOPTION_STATUS_LABELS: Record<AdoptionStatus, string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const ADOPTION_STATUS_COLORS: Record<AdoptionStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-100 text-rose-700 border-rose-200',
  completed: 'bg-sky-100 text-sky-700 border-sky-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
};

export function ageLabel(age: number): string {
  if (age === 0) return '< 1 year';
  if (age === 1) return '1 year';
  return `${age} years`;
}
