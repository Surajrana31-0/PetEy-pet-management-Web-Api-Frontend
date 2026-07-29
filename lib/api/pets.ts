import axiosInstance, { apiRequest } from './axios-instance';
import { ENDPOINTS } from './endpoints';
import type { IApiResponse } from '../types/api';
import type { IPet, IPetQueryParams, IPetCategories, PetStatus } from '../types/pet';

export const petsApi = {
  list: (params?: Record<string, unknown>) =>
    axiosInstance.get<IApiResponse<{ pets: IPet[]; total: number; page: number; limit: number }>>(
      ENDPOINTS.PETS.BASE, { params }
    ).then((r) => r.data),

  getAll: (params?: IPetQueryParams | Record<string, unknown>) =>
    axiosInstance.get<IApiResponse<{ pets: IPet[]; total: number; page: number; limit: number }>>(
      ENDPOINTS.PETS.BASE, { params: params as Record<string, unknown> }
    ).then((r) => r.data),

  getById: (id: string) =>
    axiosInstance.get<IApiResponse<IPet>>(ENDPOINTS.PETS.BY_ID(id)).then((r) => r.data),

  create: (data: Record<string, unknown>) =>
    apiRequest<IPet>({ method: 'POST', url: ENDPOINTS.PETS.BASE, data }),

  update: (id: string, data: Record<string, unknown>) =>
    apiRequest<IPet>({ method: 'PUT', url: ENDPOINTS.PETS.BY_ID(id), data }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>({ method: 'DELETE', url: ENDPOINTS.PETS.BY_ID(id) }),

  search: (q: string) =>
    axiosInstance.get<IApiResponse<IPet[]>>(ENDPOINTS.PETS.SEARCH, { params: { q } }).then((r) => r.data),

  getCategories: () =>
    axiosInstance.get<IApiResponse<IPetCategories>>(ENDPOINTS.PETS.CATEGORIES).then((r) => r.data),
};

export const getAllPets = (params?: { page?: number; limit?: number; species?: string; status?: PetStatus }) =>
  axiosInstance.get<IApiResponse<{ pets: IPet[]; total: number; page: number; limit: number }>>(
    ENDPOINTS.PETS.BASE, { params: params as Record<string, unknown> }
  ).then((r) => r.data);

export const getPetById = (id: string) =>
  axiosInstance.get<IApiResponse<IPet>>(ENDPOINTS.PETS.BY_ID(id)).then((r) => r.data);

export const getPetsByStatus = (status: string) =>
  axiosInstance.get<IApiResponse<IPet[]>>(ENDPOINTS.PETS.BY_STATUS(status)).then((r) => r.data);

export const getPetsBySpecies = (species: string) =>
  axiosInstance.get<IApiResponse<IPet[]>>(ENDPOINTS.PETS.BY_SPECIES(species)).then((r) => r.data);

export const getPetsByBreed = (breed: string) =>
  axiosInstance.get<IApiResponse<IPet[]>>(ENDPOINTS.PETS.BY_BREED(breed)).then((r) => r.data);

export const getPetsByAge = (age: string) =>
  axiosInstance.get<IApiResponse<IPet[]>>(ENDPOINTS.PETS.BY_AGE(age)).then((r) => r.data);

export const getPetCategories = () =>
  axiosInstance.get<IApiResponse<IPetCategories>>(ENDPOINTS.PETS.CATEGORIES).then((r) => r.data);
