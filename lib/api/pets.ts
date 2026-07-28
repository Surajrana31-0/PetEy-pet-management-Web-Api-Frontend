import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';
import type {
  ICreatePetPayload,
  IPetQueryParams,
  IUpdatePetPayload,
} from '../types/pet';
import { PetStatus } from '../types/pet';

export const getAllPets = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  species?: string;
  status?: string;
  breed?: string;
  age?: string;
}) => {
  try {
    const endpoint = params?.search ? ENDPOINTS.PETS.SEARCH : ENDPOINTS.PETS.GET;
    const response = await axiosInstance.get(endpoint, { params });
    const data = response.data;

    // Normalize: if data.data is a bare array, wrap it in a paginated shape
    // so all callers can rely on { pets, total, page, limit }
    if (data.success && Array.isArray(data.data)) {
      data.data = {
        pets: data.data,
        total: data.data.length,
        page: 1,
        limit: data.data.length,
      };
    }

    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch pets');
  }
};

export const getPetById = async (id: string) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PETS.GET_ONE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch pet');
  }
};

export const getPetsByStatus = async (status: string, params?: { page?: number; limit?: number }) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PETS.BY_STATUS(status), { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch pets by status');
  }
};

export const getPetsBySpecies = async (species: string, params?: { page?: number; limit?: number }) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PETS.BY_SPECIES(species), { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch pets by species');
  }
};

export const getPetsByBreed = async (breed: string, params?: { page?: number; limit?: number }) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PETS.BY_BREED(breed), { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch pets by breed');
  }
};

export const getPetsByAge = async (age: string, params?: { page?: number; limit?: number }) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PETS.BY_AGE(age), { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch pets by age');
  }
};

export const getPetCategories = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PETS.CATEGORIES);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch pet categories');
  }
};

function toRequestParams(arg?: PetStatus | IPetQueryParams) {
  if (!arg) return undefined;

  if (typeof arg === 'string') {
    return { status: arg };
  }

  const { q, ...rest } = arg;
  return {
    ...rest,
    ...(q ? { search: q } : {}),
  };
}

export const petsApi = {
  getAll: (arg?: PetStatus | IPetQueryParams) => getAllPets(toRequestParams(arg)),
  getById: getPetById,
  getCategories: getPetCategories,
  create: async (data: FormData) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.ADMIN.PETS.CREATE, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to create pet');
    }
  },
  update: async (id: string, data: FormData) => {
    try {
      const response = await axiosInstance.put(ENDPOINTS.PETS.UPDATE(id), data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to update pet');
    }
  },
  delete: async (id: string) => {
    try {
      const response = await axiosInstance.delete(ENDPOINTS.PETS.DELETE(id));
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to delete pet');
    }
  },
};