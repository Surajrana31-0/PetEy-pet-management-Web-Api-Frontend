import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';

export const createAdoption = async (data: {
  petId: string;
  applicationData: {
    livingSpace: string;
    hasYard: boolean;
    householdMembers: number;
    hasChildren: boolean;
    hasOtherPets: boolean;
    experience: string;
    reason: string;
    agreeToTerms: boolean;
  };
}) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.ADOPTIONS.CREATE, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to submit adoption application');
  }
};

export const getMyAdoptions = async (params?: { page?: number; limit?: number }) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.MY, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch your adoptions');
  }
};

export const getAdoptionById = async (id: string) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.GET_ONE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch adoption');
  }
};

export const cancelAdoption = async (id: string, reason?: string) => {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.ADOPTIONS.CANCEL(id), { reason });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to cancel adoption');
  }
};

export const getAdoptionsByPet = async (petId: string) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.BY_PET(petId));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch pet adoptions');
  }
};

// Admin functions
export const getAdoptionStatistics = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.STATISTICS);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch adoption statistics');
  }
};

export const getPendingAdoptions = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.PENDING);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch pending adoptions');
  }
};

export const approveAdoption = async (id: string, adminNotes?: string) => {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.ADOPTIONS.APPROVE(id), { adminNotes });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to approve adoption');
  }
};

export const rejectAdoption = async (id: string, adminNotes?: string) => {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.ADOPTIONS.REJECT(id), { adminNotes });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to reject adoption');
  }
};

export const completeAdoption = async (id: string) => {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.ADOPTIONS.COMPLETE(id), {});
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to complete adoption');
  }
};

export const getAdoptionsByUser = async (userId: string, params?: { page?: number; limit?: number }) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADOPTIONS.BY_USER(userId), { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch user adoptions');
  }
};


