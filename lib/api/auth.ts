import { clearClientCookies, getCookieHeader, setAuthCookiesFromResponse } from '../cookies';
import type {
  IBackendResponse,
  ILoginPayload,
  IRegisterPayload,
  IUser,
} from '../types/auth';
import { axiosInstance } from './axios-instance';
import { ENDPOINTS } from './endpoints';

export const authApi = {
  register: async (data: IRegisterPayload): Promise<IBackendResponse<IUser>> => {
    const response = await axiosInstance.post<IBackendResponse<IUser>>(ENDPOINTS.REGISTER, data);
    return response.data;
  },

  login: async (data: ILoginPayload): Promise<IBackendResponse<IUser>> => {
    const response = await axiosInstance.post<IBackendResponse<IUser>>(ENDPOINTS.LOGIN, data);
    await setAuthCookiesFromResponse(response);
    return response.data;
  },

  logout: async (): Promise<IBackendResponse<null>> => {
    const cookieHeader = await getCookieHeader();
    const response = await axiosInstance.post<IBackendResponse<null>>(
      ENDPOINTS.LOGOUT,
      {},
      {
        headers: cookieHeader ? { Cookie: cookieHeader } : {},
      },
    );
    await clearClientCookies();
    return response.data;
  },

  me: async (): Promise<IBackendResponse<IUser>> => {
    const cookieHeader = await getCookieHeader();
    const response = await axiosInstance.get<IBackendResponse<IUser>>(ENDPOINTS.ME, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
    });
    return response.data;
  },
};
