import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';

export interface IAdoptionApplicationData {
  livingSpace: 'apartment' | 'house' | 'farm';
  hasYard: boolean;
  householdMembers: number;
  hasChildren: boolean;
  childrenAges?: number[];
  hasOtherPets: boolean;
  otherPetsDetails?: string;
  experience: 'none' | 'beginner' | 'intermediate' | 'expert';
  workSchedule: string;
  reasonForAdoption: string;
  veterinarianInfo?: string;
  references?: string[];
}

export interface ICreateAdoptionPayload {
  petId: string;
  applicationData: IAdoptionApplicationData;
}

export const adoptionsApi = {
  create: async (data: ICreateAdoptionPayload) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.ADOPTIONS.CREATE, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to submit adoption application');
    }
  },

  getMy: async (params?: { page?: number; limit?: number }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.MY, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch your adoptions');
    }
  },

  getById: async (id: string) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.GET_ONE(id));
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch adoption');
    }
  },

  cancel: async (id: string) => {
    try {
      const response = await axiosInstance.patch(ENDPOINTS.ADOPTIONS.CANCEL(id));
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to cancel adoption');
    }
  },

  getByPet: async (petId: string) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.BY_PET(petId));
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch pet adoptions');
    }
  },

  // Admin APIs
  getStats: async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.STATISTICS);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch adoption statistics');
    }
  },

  getPending: async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.PENDING);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch pending adoptions');
    }
  },

  approve: async (id: string, adminNotes?: string) => {
    try {
      const response = await axiosInstance.patch(ENDPOINTS.ADOPTIONS.APPROVE(id), { adminNotes });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to approve adoption');
    }
  },

  reject: async (id: string, adminNotes: string) => {
    try {
      const response = await axiosInstance.patch(ENDPOINTS.ADOPTIONS.REJECT(id), { adminNotes });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to reject adoption');
    }
  },

  complete: async (id: string, adminNotes?: string) => {
    try {
      const response = await axiosInstance.patch(ENDPOINTS.ADOPTIONS.COMPLETE(id), { adminNotes });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to complete adoption');
    }
  },

  getByUser: async (userId: string, params?: { page?: number; limit?: number }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.BY_USER(userId), { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch user adoptions');
    }
  },
};
