import type { IBackendResponse } from '../types/auth';
import type {
  ICreatePetPayload,
  IPaginatedPets,
  IPet,
  IPetCategories,
  IPetQueryParams,
  IUpdatePetPayload,
  PetSortOption,
  PetSpecies,
  PetStatus,
} from '../types/pet';
import { getAuthHeaders } from './get-auth-headers';
import { axiosInstance } from './axios-instance';
import { ENDPOINTS } from './endpoints';

function sortPets(pets: IPet[], sort: PetSortOption = 'newest'): IPet[] {
  const copy = [...pets];
  switch (sort) {
    case 'name-asc':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    case 'age':
      return copy.sort((a, b) => a.age.localeCompare(b.age));
    default:
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}

export const petsApi = {
  getAll: async (params: IPetQueryParams = {}): Promise<IBackendResponse<IPaginatedPets>> => {
    const { q, sort, ...query } = params;

    if (q?.trim()) {
      const response = await axiosInstance.get<IBackendResponse<IPaginatedPets>>(
        ENDPOINTS.PETS.SEARCH,
        { params: { ...query, q: q.trim() } },
      );
      const data = response.data.data;
      if (data?.pets && sort) {
        data.pets = sortPets(data.pets, sort);
      }
      return response.data;
    }

    const response = await axiosInstance.get<IBackendResponse<IPaginatedPets>>(ENDPOINTS.PETS.GET, {
      params: query,
    });
    const data = response.data.data;
    if (data?.pets && sort) {
      data.pets = sortPets(data.pets, sort);
    }
    return response.data;
  },

  getById: async (id: string): Promise<IBackendResponse<IPet>> => {
    const response = await axiosInstance.get<IBackendResponse<IPet>>(
      ENDPOINTS.PETS.GET_ONE(id),
    );
    return response.data;
  },

  getCategories: async (): Promise<IBackendResponse<IPetCategories>> => {
    const response = await axiosInstance.get<IBackendResponse<IPetCategories>>(
      ENDPOINTS.PETS.CATEGORIES,
    );
    return response.data;
  },

  addFavorite: async (id: string): Promise<IBackendResponse<unknown>> => {
    const response = await axiosInstance.post<IBackendResponse<unknown>>(
      ENDPOINTS.PETS.FAVORITE(id),
      {},
      { headers: await getAuthHeaders() },
    );
    return response.data;
  },

  create: async (data: ICreatePetPayload): Promise<IBackendResponse<IPet>> => {
    const response = await axiosInstance.post<IBackendResponse<IPet>>(
      ENDPOINTS.ADMIN.PETS.CREATE,
      data,
      { headers: await getAuthHeaders() },
    );
    return response.data;
  },

  update: async (id: string, data: IUpdatePetPayload): Promise<IBackendResponse<IPet>> => {
    const response = await axiosInstance.put<IBackendResponse<IPet>>(
      ENDPOINTS.ADMIN.PETS.UPDATE(id),
      data,
      { headers: await getAuthHeaders() },
    );
    return response.data;
  },

  delete: async (id: string): Promise<IBackendResponse<null>> => {
    const response = await axiosInstance.delete<IBackendResponse<null>>(
      ENDPOINTS.ADMIN.PETS.DELETE(id),
      { headers: await getAuthHeaders() },
    );
    return response.data;
  },
};

/** @deprecated Use getAll({ status }) — returns pets array from paginated response */
export async function getAvailablePets(status?: PetStatus): Promise<IPet[]> {
  const response = await petsApi.getAll({
    status: status ?? PetStatus.AVAILABLE,
    limit: 50,
  });
  return response.success && response.data ? response.data.pets : [];
}
