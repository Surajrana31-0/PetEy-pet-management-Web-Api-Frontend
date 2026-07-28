import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';
import { throwApiError } from './errors';
import type { IApiResponse } from '../types/api';
import type { IPaginatedPets, IPetCategories, IPet, IPetQueryParams } from '../types/pet';
import { PetStatus } from '../types/pet';

export async function getAllPets(params?: {
  page?: number;
  limit?: number;
  search?: string;
  species?: string;
  status?: string;
  breed?: string;
  age?: string;
}): Promise<IApiResponse<IPaginatedPets>> {
  try {
    const endpoint = params?.search ? ENDPOINTS.PETS.SEARCH : ENDPOINTS.PETS.GET;
    const response = await axiosInstance.get(endpoint, { params });
    const data = response.data as IApiResponse<IPet[] | IPaginatedPets>;

    if (data.success && Array.isArray(data.data)) {
      data.data = {
        pets: data.data,
        total: data.data.length,
        page: 1,
        limit: data.data.length,
      };
    }

    return data as IApiResponse<IPaginatedPets>;
  } catch (error) {
    throwApiError(error, 'Failed to fetch pets');
  }
}

export async function getPetById(id: string): Promise<IApiResponse<IPet>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PETS.GET_ONE(id));
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch pet');
  }
}

export async function getPetsByStatus(
  status: string,
  params?: { page?: number; limit?: number },
): Promise<IApiResponse<IPaginatedPets>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PETS.BY_STATUS(status), { params });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch pets by status');
  }
}

export async function getPetsBySpecies(
  species: string,
  params?: { page?: number; limit?: number },
): Promise<IApiResponse<IPaginatedPets>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PETS.BY_SPECIES(species), { params });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch pets by species');
  }
}

export async function getPetsByBreed(
  breed: string,
  params?: { page?: number; limit?: number },
): Promise<IApiResponse<IPaginatedPets>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PETS.BY_BREED(breed), { params });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch pets by breed');
  }
}

export async function getPetsByAge(
  age: string,
  params?: { page?: number; limit?: number },
): Promise<IApiResponse<IPaginatedPets>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PETS.BY_AGE(age), { params });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch pets by age');
  }
}

export async function getPetCategories(): Promise<IApiResponse<IPetCategories>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PETS.CATEGORIES);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch pet categories');
  }
}

function toRequestParams(arg?: PetStatus | IPetQueryParams) {
  if (!arg) return undefined;
  if (typeof arg === 'string') return { status: arg };
  const { q, ...rest } = arg;
  return { ...rest, ...(q ? { search: q } : {}) };
}

export const petsApi = {
  getAll: (arg?: PetStatus | IPetQueryParams) => getAllPets(toRequestParams(arg)),
  getById: getPetById,
  getCategories: getPetCategories,
  create: async (data: FormData): Promise<IApiResponse<IPet>> => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.ADMIN.PETS.CREATE, data);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to create pet');
    }
  },
  update: async (id: string, data: FormData): Promise<IApiResponse<IPet>> => {
    try {
      const response = await axiosInstance.put(ENDPOINTS.PETS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to update pet');
    }
  },
  delete: async (id: string): Promise<IApiResponse<null>> => {
    try {
      const response = await axiosInstance.delete(ENDPOINTS.PETS.DELETE(id));
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to delete pet');
    }
  },
};
