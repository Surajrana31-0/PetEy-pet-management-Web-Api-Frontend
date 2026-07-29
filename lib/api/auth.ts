import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';
import type { IApiResponse } from '../types/api';
import type { IUser, ILoginResponseData, IRegisterPayload, ILoginPayload } from '../types/auth';

export const authApi = {
  register: (body: IRegisterPayload) =>
    axiosInstance.post<IApiResponse<ILoginResponseData>>(ENDPOINTS.AUTH.REGISTER, body).then((r) => r.data),

  login: (body: ILoginPayload) =>
    axiosInstance.post<IApiResponse<ILoginResponseData>>(ENDPOINTS.AUTH.LOGIN, body).then((r) => r.data),

  logout: () =>
    axiosInstance.post<IApiResponse<null>>(ENDPOINTS.AUTH.LOGOUT).then((r) => r.data),

  me: () =>
    axiosInstance.get<IApiResponse<IUser>>(ENDPOINTS.AUTH.ME).then((r) => r.data),

  updateProfile: (data: Record<string, unknown>) => {
    const isFormData =
      typeof FormData !== 'undefined' && data instanceof FormData;
    return axiosInstance
      .put<IApiResponse<IUser>>(ENDPOINTS.AUTH.UPDATE, data, isFormData ? {
        headers: { 'Content-Type': 'multipart/form-data' },
      } : undefined)
      .then((r) => r.data);
  },

  updatePassword: (body: { currentPassword: string; newPassword: string }) =>
    axiosInstance.patch<IApiResponse<null>>(ENDPOINTS.AUTH.PASSWORD, body).then((r) => r.data),

  forgotPassword: (body: { email: string }) =>
    axiosInstance.post<IApiResponse<null>>(ENDPOINTS.AUTH.FORGOT_PASSWORD, body).then((r) => r.data),

  resetPassword: (body: { token: string; newPassword: string }) =>
    axiosInstance.post<IApiResponse<null>>(ENDPOINTS.AUTH.RESET_PASSWORD, body).then((r) => r.data),

  verifyEmail: (body: { token: string }) =>
    axiosInstance.post<IApiResponse<null>>(ENDPOINTS.AUTH.VERIFY_EMAIL, body).then((r) => r.data),

  refreshToken: (body: { refreshToken: string }) =>
    axiosInstance.post<IApiResponse<ILoginResponseData>>(ENDPOINTS.AUTH.REFRESH_TOKEN, body).then((r) => r.data),
};

export const register = authApi.register;
export const login = authApi.login;
export const logout = authApi.logout;
export const whoami = authApi.me;
export const profileUpdate = authApi.updateProfile;
export const updatePassword = authApi.updatePassword;
export const requestPasswordReset = authApi.forgotPassword;
export const resetPassword = authApi.resetPassword;
export const verifyEmail = authApi.verifyEmail;
