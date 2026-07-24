import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';

export const getAllVets = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  location?: string;
}) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.VETS.GET, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch veterinarians');
  }
};

export const getVetById = async (id: string) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.VETS.GET_ONE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch veterinarian');
  }
};


