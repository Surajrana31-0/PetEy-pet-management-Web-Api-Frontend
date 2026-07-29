import { UserRole } from './auth';

export { UserRole } from './auth';
export type { IUser, IUserPreferences, ILoginResponseData, ILoginPayload, IRegisterPayload } from './auth';

export type PetSpecies = 'DOG' | 'CAT';

export type PetStatus = 'AVAILABLE' | 'PENDING' | 'ADOPTED';

export interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  location?: string;
  role: UserRole;
  profileImage?: string | null;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}

export interface Pet {
  _id: string;
  name: string;
  age: number;
  breed: string;
  species: PetSpecies;
  description: string;
  emoji?: string;
  status: PetStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePetInput {
  name: string;
  age: number;
  breed: string;
  species: PetSpecies;
  description: string;
  emoji?: string;
  status?: PetStatus;
}

export interface UpdatePetInput extends Partial<CreatePetInput> {}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
}
