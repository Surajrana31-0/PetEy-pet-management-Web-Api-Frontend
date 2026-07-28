import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';

export const getAdminVets = async (params?: Record<string, any>) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.VETS.GET, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch admin veterinarians');
  }
};

export const getAdminVetStats = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.VETS.STATS);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch vet statistics');
  }
};

export const createVet = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.ADMIN.VETS.CREATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create veterinarian');
  }
};

export const updateVet = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(ENDPOINTS.ADMIN.VETS.UPDATE(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update veterinarian');
  }
};

export const toggleVetActive = async (id: string) => {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.ADMIN.VETS.TOGGLE_ACTIVE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to toggle active status');
  }
};

export const deleteVet = async (id: string) => {
  try {
    const response = await axiosInstance.delete(ENDPOINTS.ADMIN.VETS.DELETE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to delete veterinarian');
  }
};
