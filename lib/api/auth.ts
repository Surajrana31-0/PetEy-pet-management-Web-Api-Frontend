import { clearClientCookies, getCookieHeader, setAuthCookies } from '../cookies';
import type {
  IBackendResponse,
  ILoginPayload,
  ILoginResponseData,
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

  login: async (data: ILoginPayload): Promise<IBackendResponse<ILoginResponseData>> => {
    const response = await axiosInstance.post<IBackendResponse<ILoginResponseData>>(
      ENDPOINTS.LOGIN,
      data,
    );

    const loginData = response.data.data;
    if (loginData?.accessToken && loginData?.refreshToken) {
      await setAuthCookies(loginData.accessToken, loginData.refreshToken);
    }

    return response.data;
  },

  logout: async (): Promise<IBackendResponse<null>> => {
    const cookieHeader = await getCookieHeader();
    await axiosInstance.post<IBackendResponse<null>>(
      ENDPOINTS.LOGOUT,
      {},
      {
        headers: cookieHeader ? { Cookie: cookieHeader } : {},
      },
    );
    await clearClientCookies();
    return { success: true, message: 'Logout successful', data: null };
  },

  me: async (): Promise<IBackendResponse<IUser>> => {
    const cookieHeader = await getCookieHeader();
    const response = await axiosInstance.get<IBackendResponse<IUser>>(ENDPOINTS.ME, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
    });
    return response.data;
  },
};
