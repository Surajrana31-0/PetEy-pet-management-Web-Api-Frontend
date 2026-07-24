import axiosInstance from "./axios-instance";
import { ENDPOINTS } from "./endpoints";


export const register = async (data: {
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Registration failed');
  }
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Login failed');
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT, {});
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Logout failed');
  }
};

export const whoami = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.AUTH.ME);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch user info');
  }
};

export const profileUpdate = async (data: FormData) => {
  try {
    const response = await axiosInstance.put(ENDPOINTS.AUTH.UPDATE, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Profile update failed');
  }
};

export const updatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.AUTH.UPDATE_PASSWORD, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Password update failed');
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Request password reset failed');
  }
};

// Token goes in the request body, NOT the URL
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Reset password failed');
  }
};
