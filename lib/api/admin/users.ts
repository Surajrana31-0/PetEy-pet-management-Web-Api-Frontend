import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import { throwApiError } from '../errors';
import type { IApiResponse } from '../../types/api';
import type { IUser, UserRole } from '../../types/auth';

export interface ICreateUserPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role?: string;
}

export async function getAllUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<IApiResponse<IUser[]>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.USERS.GET, { params });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch users');
  }
}

export async function getUserById(id: string): Promise<IApiResponse<IUser>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.USERS.GET_ONE(id));
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch user');
  }
}

export async function createUser(data: ICreateUserPayload): Promise<IApiResponse<IUser>> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.ADMIN.USERS.CREATE, data);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to create user');
  }
}

export async function updateUser(id: string, data: Record<string, unknown>): Promise<IApiResponse<IUser>> {
  try {
    const response = await axiosInstance.put(ENDPOINTS.ADMIN.USERS.UPDATE(id), data);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to update user');
  }
}

export async function deleteUser(id: string): Promise<IApiResponse<null>> {
  try {
    const response = await axiosInstance.delete(ENDPOINTS.ADMIN.USERS.DELETE(id));
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to delete user');
  }
}

export async function updateUserRole(id: string, role: UserRole | string): Promise<IApiResponse<IUser>> {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.ADMIN.USERS.UPDATE_ROLE(id), { role });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to update user role');
  }
}

export async function getUserStats(): Promise<IApiResponse<Record<string, number>>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.USERS.STATS);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch user stats');
  }
}
