import { apiRequest } from './axios-instance';
import { ENDPOINTS } from './endpoints';
import type { Pet, CreatePetInput, UpdatePetInput, PetStatus } from '@/lib/types';

export const petsApi = {
  list: (params?: { status?: PetStatus }) =>
    apiRequest<{ pets: Pet[] } | Pet[]>({ method: 'GET', url: ENDPOINTS.PETS.BASE, params }),

  getById: (id: string) =>
    apiRequest<Pet>({ method: 'GET', url: ENDPOINTS.PETS.BY_ID(id) }),

  create: (body: CreatePetInput) =>
    apiRequest<Pet>({ method: 'POST', url: ENDPOINTS.PETS.BASE, data: body }),

  update: (id: string, body: UpdatePetInput) =>
    apiRequest<Pet>({ method: 'PUT', url: ENDPOINTS.PETS.BY_ID(id), data: body }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>({ method: 'DELETE', url: ENDPOINTS.PETS.BY_ID(id) }),
};
