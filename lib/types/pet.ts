export enum PetSpecies {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  RABBIT = 'RABBIT',
  OTHER = 'OTHER',
}

export enum PetSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum PetGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNKNOWN = 'UNKNOWN',
}

export enum PetStatus {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  ADOPTED = 'ADOPTED',
}

export interface IPet {
  _id: string;
  name: string;
  age: string;
  breed: string;
  species: PetSpecies;
  description: string;
  aiGeneratedDescription?: string | null;
  emoji: string;
  imageUrl?: string | null;
  size?: PetSize;
  gender?: PetGender;
  weight?: string | null;
  energyLevel?: string;
  temperament?: string[];
  healthStatus?: string;
  vaccinated?: boolean;
  status: PetStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPaginatedPets {
  pets: IPet[];
  total: number;
  page: number;
  limit: number;
}

export interface IPetCategories {
  species: string[];
  breeds: string[];
  sizes: string[];
}

export type PetSortOption = 'newest' | 'name-asc' | 'name-desc' | 'age';

export interface IPetQueryParams {
  page?: number;
  limit?: number;
  species?: PetSpecies;
  status?: PetStatus;
  size?: PetSize;
  breed?: string;
  q?: string;
  sort?: PetSortOption;
}

export interface ICreatePetPayload {
  name: string;
  age: string;
  breed: string;
  species: PetSpecies;
  description: string;
  emoji?: string;
  status?: PetStatus;
}

export interface IUpdatePetPayload {
  name?: string;
  age?: string;
  breed?: string;
  species?: PetSpecies;
  description?: string;
  emoji?: string;
  status?: PetStatus;
}

export interface IPetActionResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export interface IAiPetMatch {
  pet: IPet;
  score: number;
  reason: string;
}
