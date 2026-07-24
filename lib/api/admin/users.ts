import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';

export const getAllUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.USERS.GET, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch users');
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.USERS.GET_ONE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch user');
  }
};

export const createUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.ADMIN.USERS.CREATE, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create user');
  }
};

export const updateUser = async (id: string, data: Record<string, unknown>) => {
  try {
    const response = await axiosInstance.put(ENDPOINTS.ADMIN.USERS.UPDATE(id), data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update user');
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axiosInstance.delete(ENDPOINTS.ADMIN.USERS.DELETE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to delete user');
  }
};

export const updateUserRole = async (id: string, role: string) => {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.ADMIN.USERS.UPDATE_ROLE(id), { role });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update user role');
  }
};

export const getUserStats = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.USERS.STATS);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch user stats');
  }
};

