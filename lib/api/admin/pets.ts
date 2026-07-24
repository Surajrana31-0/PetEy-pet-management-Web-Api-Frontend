import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';

export const getAllAdminPets = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  species?: string;
}) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.PETS.GET, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch pets');
  }
};

export const getAdminPetById = async (id: string) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.PETS.GET_ONE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch pet');
  }
};

export const createPet = async (data: FormData) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.ADMIN.PETS.CREATE, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create pet');
  }
};

export const updatePet = async (id: string, data: FormData | Record<string, unknown>) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.put(ENDPOINTS.ADMIN.PETS.UPDATE(id), data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update pet');
  }
};

export const updatePetStatus = async (id: string, status: string) => {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.ADMIN.PETS.UPDATE_STATUS(id), { status });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update pet status');
  }
};

export const deletePet = async (id: string) => {
  try {
    const response = await axiosInstance.delete(ENDPOINTS.ADMIN.PETS.DELETE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to delete pet');
  }
};

export const getPetDashboardStats = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.PETS.STATS);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch pet stats');
  }
};