import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import { throwApiError } from '../errors';
import type { IApiResponse } from '../../types/api';
import type { IVeterinarian } from '../../types/vet';

export async function getAdminVets(params?: Record<string, unknown>): Promise<IApiResponse<IVeterinarian[]>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.VETS.GET, { params });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch admin veterinarians');
  }
}

export async function getAdminVetStats(): Promise<IApiResponse<Record<string, number>>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.VETS.STATS);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch vet statistics');
  }
}

export async function createVet(formData: FormData): Promise<IApiResponse<IVeterinarian>> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.ADMIN.VETS.CREATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to create veterinarian');
  }
}

export async function updateVet(id: string, formData: FormData): Promise<IApiResponse<IVeterinarian>> {
  try {
    const response = await axiosInstance.put(ENDPOINTS.ADMIN.VETS.UPDATE(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to update veterinarian');
  }
}

export async function toggleVetActive(id: string, isActive: boolean): Promise<IApiResponse<IVeterinarian>> {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.ADMIN.VETS.TOGGLE_ACTIVE(id), { isActive });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to toggle active status');
  }
}

export async function deleteVet(id: string): Promise<IApiResponse<null>> {
  try {
    const response = await axiosInstance.delete(ENDPOINTS.ADMIN.VETS.DELETE(id));
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to delete veterinarian');
  }
}
