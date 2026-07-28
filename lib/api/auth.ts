import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';
import { throwApiError } from './errors';
import type { IApiResponse } from '../types/api';
import type { ILoginResponseData, IUser } from '../types/auth';

export async function register(data: {
  fullName: string;
  username: string;
  email: string;
  password: string;
}): Promise<IApiResponse> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Registration failed');
  }
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<IApiResponse<ILoginResponseData>> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Login failed');
  }
}

export async function logout(): Promise<IApiResponse> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT, {});
    return response.data;
  } catch (error) {
    throwApiError(error, 'Logout failed');
  }
}

export async function whoami(): Promise<IApiResponse<IUser>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.AUTH.ME);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch user info');
  }
}

export async function profileUpdate(data: FormData): Promise<IApiResponse<IUser>> {
  try {
    const response = await axiosInstance.put(ENDPOINTS.AUTH.UPDATE, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Profile update failed');
  }
}

export async function updatePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<IApiResponse> {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.AUTH.UPDATE_PASSWORD, data);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Password update failed');
  }
}

export async function requestPasswordReset(email: string): Promise<IApiResponse> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Request password reset failed');
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<IApiResponse> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Reset password failed');
  }
}

export async function verifyEmail(token: string): Promise<IApiResponse> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Email verification failed');
  }
}
