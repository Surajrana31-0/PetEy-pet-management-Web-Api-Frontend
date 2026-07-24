import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';

export const getAllAdminVets = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  isActive?: boolean;
}) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.VETS.GET, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch veterinarians');
  }
};

export const getAdminVetById = async (id: string) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.VETS.GET_ONE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch veterinarian');
  }
};

export const createVet = async (data: FormData | Record<string, unknown>) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.post(ENDPOINTS.ADMIN.VETS.CREATE, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create veterinarian');
  }
};

export const updateVet = async (id: string, data: FormData | Record<string, unknown>) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.put(ENDPOINTS.ADMIN.VETS.UPDATE(id), data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update veterinarian');
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

export const toggleVetActive = async (id: string, isActive: boolean) => {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.ADMIN.VETS.TOGGLE_ACTIVE(id), { isActive });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to toggle veterinarian status');
  }
};

export const updateVetProfileImage = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.ADMIN.VETS.UPDATE_PROFILE_IMAGE(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update profile image');
  }
};

export const getVetStatistics = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.VETS.STATS);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch vet statistics');
  }
};
