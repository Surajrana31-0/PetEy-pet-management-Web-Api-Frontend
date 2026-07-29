import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import { throwApiError } from '../errors';
import type { IApiResponse } from '../../types/api';
import type { IUser } from '../../types/auth';

export interface IUserManagementFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: 'active' | 'suspended';
  search?: string;
}

export const adminUserManagementApi = {
  getUsers: async (params?: IUserManagementFilters): Promise<IApiResponse<IUser[]>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.USERS_MANAGEMENT.GET, { params });
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch users');
    }
  },

  getStats: async (): Promise<IApiResponse<Record<string, number>>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.USERS_MANAGEMENT.STATS);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch user management stats');
    }
  },

  suspendUser: async (id: string, reason: string): Promise<IApiResponse<IUser>> => {
    try {
      const response = await axiosInstance.patch(ENDPOINTS.ADMIN.USERS_MANAGEMENT.SUSPEND(id), { reason });
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to suspend user');
    }
  },

  activateUser: async (id: string): Promise<IApiResponse<IUser>> => {
    try {
      const response = await axiosInstance.patch(ENDPOINTS.ADMIN.USERS_MANAGEMENT.ACTIVATE(id));
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to activate user');
    }
  },
};
