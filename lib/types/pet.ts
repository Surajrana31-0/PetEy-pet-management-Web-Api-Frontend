export enum PetSpecies {
  DOG = 'DOG',
  CAT = 'CAT',
}

export enum PetSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum PetGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum PetStatus {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  ADOPTED = 'ADOPTED',
}

export enum ActivityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface IPet {
  _id: string;
  name: string;
  age: number;
  breed: string;
  species: PetSpecies;
  description: string;
  emoji?: string;
  status?: PetStatus;
  size?: PetSize;
  gender?: PetGender;
  location?: string | null;
  adoptionFee?: number;
  goodWithKids?: boolean;
  goodWithPets?: boolean;
  vaccinated?: boolean;
  neutered?: boolean;
  images?: string[];
  healthStatus?: string;
  temperament?: string[];
  activityLevel?: ActivityLevel;
  aiGeneratedDescription?: string | null;
  createdAt?: string;
  updatedAt?: string;
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
  age: number;
  breed: string;
  species: PetSpecies;
  description: string;
  emoji?: string;
  status?: PetStatus;
  size?: PetSize;
  gender?: PetGender;
  location?: string;
  adoptionFee?: number;
  goodWithKids?: boolean;
  goodWithPets?: boolean;
  vaccinated?: boolean;
  neutered?: boolean;
  healthStatus?: string;
  temperament?: string[];
  activityLevel?: ActivityLevel;
  images?: string[];
}

export type IUpdatePetPayload = Partial<ICreatePetPayload>;

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
