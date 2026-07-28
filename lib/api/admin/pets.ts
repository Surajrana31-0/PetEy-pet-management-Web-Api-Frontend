import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import { throwApiError } from '../errors';
import type { IApiResponse } from '../../types/api';
import type { IPet, PetStatus } from '../../types/pet';

export async function getAllAdminPets(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  species?: string;
}): Promise<IApiResponse<IPet[]>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.PETS.GET, { params });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch pets');
  }
}

export async function getAdminPetById(id: string): Promise<IApiResponse<IPet>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.PETS.GET_ONE(id));
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch pet');
  }
}

export async function createPet(data: FormData): Promise<IApiResponse<IPet>> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.ADMIN.PETS.CREATE, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to create pet');
  }
}

export async function updatePet(
  id: string,
  data: FormData | Record<string, unknown>,
): Promise<IApiResponse<IPet>> {
  try {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.put(ENDPOINTS.ADMIN.PETS.UPDATE(id), data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to update pet');
  }
}

export async function updatePetStatus(
  id: string,
  status: PetStatus | string,
): Promise<IApiResponse<IPet>> {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.ADMIN.PETS.UPDATE_STATUS(id), { status });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to update pet status');
  }
}

export async function deletePet(id: string): Promise<IApiResponse<null>> {
  try {
    const response = await axiosInstance.delete(ENDPOINTS.ADMIN.PETS.DELETE(id));
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to delete pet');
  }
}

export async function getPetDashboardStats(): Promise<IApiResponse<Record<string, number>>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.PETS.STATS);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch pet stats');
  }
}
