import { axiosInstance } from './axios-instance';
import { ENDPOINTS } from './endpoints';

export interface IBackendGenericResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export const authApi = {
  register: async (data: Record<string, string>): Promise<IBackendGenericResponse<any>> => {
    const res = await axiosInstance.post(ENDPOINTS.REGISTER, data);
    return res.data;
  },
  login: async (data: Record<string, string>): Promise<IBackendGenericResponse<any>> => {
    const res = await axiosInstance.post(ENDPOINTS.LOGIN, data);
    return res.data;
  },
  logout: async (): Promise<IBackendGenericResponse<null>> => {
    const res = await axiosInstance.post(ENDPOINTS.LOGOUT);
    return res.data;
  },
  me: async (cookieHeader?: string): Promise<IBackendGenericResponse<any>> => {
    const res = await axiosInstance.get(ENDPOINTS.ME, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {}
    });
    return res.data;
  }
};