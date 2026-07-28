import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';
import { throwApiError } from './errors';
import type { IApiResponse } from '../types/api';
import type { IVeterinarian } from '../types/vet';

export async function getAllVets(params?: {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  location?: string;
}): Promise<IApiResponse<IVeterinarian[]>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.VETS.GET, { params });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch veterinarians');
  }
}

export async function getVetById(id: string): Promise<IApiResponse<IVeterinarian>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.VETS.GET_ONE(id));
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch veterinarian');
  }
}
