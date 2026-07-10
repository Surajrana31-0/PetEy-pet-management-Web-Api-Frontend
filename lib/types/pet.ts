export enum PetSpecies {
  DOG = 'DOG',
  CAT = 'CAT',
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
  emoji: string;
  status: PetStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
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
  data?: any;
}
