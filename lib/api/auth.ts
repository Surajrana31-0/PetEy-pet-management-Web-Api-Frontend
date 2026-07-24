import type {
  IBackendResponse,
  ILoginPayload,
  ILoginResponseData,
  IRegisterPayload,
  IUser,
} from '../types/auth';
import { getAuthHeaders } from './get-auth-headers';
import { axiosInstance } from './axios-instance';
import { ENDPOINTS } from './endpoints';

export async function register(data: IRegisterPayload): Promise<IBackendResponse<IUser>> {
  const response = await axiosInstance.post<IBackendResponse<IUser>>(
    ENDPOINTS.AUTH.REGISTER,
    data,
  );
  return response.data;
}

export async function login(data: ILoginPayload): Promise<IBackendResponse<ILoginResponseData>> {
  const response = await axiosInstance.post<IBackendResponse<ILoginResponseData>>(
    ENDPOINTS.AUTH.LOGIN,
    data,
  );
  return response.data;
}

export async function logout(): Promise<IBackendResponse<null>> {
  const response = await axiosInstance.post<IBackendResponse<null>>(
    ENDPOINTS.AUTH.LOGOUT,
    {},
    { headers: await getAuthHeaders() },
  );
  return response.data;
}

export async function whoami(): Promise<IBackendResponse<IUser>> {
  const response = await axiosInstance.get<IBackendResponse<IUser>>(ENDPOINTS.AUTH.PROFILE, {
    headers: await getAuthHeaders(),
  });
  return response.data;
}

export async function profileUpdate(data: FormData): Promise<IBackendResponse<IUser>> {
  const response = await axiosInstance.put<IBackendResponse<IUser>>(ENDPOINTS.AUTH.UPDATE, data, {
    headers: {
      ...(await getAuthHeaders()),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function requestPasswordReset(email: string): Promise<IBackendResponse<null>> {
  const response = await axiosInstance.post<IBackendResponse<null>>(
    ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET,
    { email },
  );
  return response.data;
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<IBackendResponse<null>> {
  const response = await axiosInstance.post<IBackendResponse<null>>(
    ENDPOINTS.AUTH.RESET_PASSWORD(token),
    { newPassword },
  );
  return response.data;
}
