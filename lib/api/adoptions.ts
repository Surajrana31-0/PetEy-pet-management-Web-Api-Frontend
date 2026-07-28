import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';
import { throwApiError } from './errors';
import type { IApiResponse } from '../types/api';

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

export interface IAdoption {
  _id: string;
  petId: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  applicationData: IAdoptionApplicationData;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const adoptionsApi = {
  create: async (data: ICreateAdoptionPayload): Promise<IApiResponse<IAdoption>> => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.ADOPTIONS.CREATE, data);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to submit adoption application');
    }
  },

  getMy: async (params?: { page?: number; limit?: number }): Promise<IApiResponse<IAdoption[]>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.MY, { params });
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch your adoptions');
    }
  },

  getById: async (id: string): Promise<IApiResponse<IAdoption>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.GET_ONE(id));
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch adoption');
    }
  },

  cancel: async (id: string): Promise<IApiResponse<IAdoption>> => {
    try {
      const response = await axiosInstance.patch(ENDPOINTS.ADOPTIONS.CANCEL(id));
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to cancel adoption');
    }
  },

  getByPet: async (petId: string): Promise<IApiResponse<IAdoption[]>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.BY_PET(petId));
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch pet adoptions');
    }
  },

  getStats: async (): Promise<IApiResponse<Record<string, number>>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.STATISTICS);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch adoption statistics');
    }
  },

  getPending: async (): Promise<IApiResponse<IAdoption[]>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.PENDING);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch pending adoptions');
    }
  },

  approve: async (id: string, adminNotes?: string): Promise<IApiResponse<IAdoption>> => {
    try {
      const response = await axiosInstance.patch(ENDPOINTS.ADOPTIONS.APPROVE(id), { adminNotes });
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to approve adoption');
    }
  },

  reject: async (id: string, adminNotes: string): Promise<IApiResponse<IAdoption>> => {
    try {
      const response = await axiosInstance.patch(ENDPOINTS.ADOPTIONS.REJECT(id), { adminNotes });
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to reject adoption');
    }
  },

  complete: async (id: string, adminNotes?: string): Promise<IApiResponse<IAdoption>> => {
    try {
      const response = await axiosInstance.patch(ENDPOINTS.ADOPTIONS.COMPLETE(id), { adminNotes });
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to complete adoption');
    }
  },

  getByUser: async (
    userId: string,
    params?: { page?: number; limit?: number },
  ): Promise<IApiResponse<IAdoption[]>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.BY_USER(userId), { params });
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch user adoptions');
    }
  },
};
