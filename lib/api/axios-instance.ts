import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './endpoints';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

let cachedToken: string | null = null;

export function setCachedToken(token: string | null): void {
  cachedToken = token;
}

export function clearCachedToken(): void {
  cachedToken = null;
}

let serverCookieHeader: string | null = null;

export async function setServerCookieHeader(header: string | null): Promise<void> {
  serverCookieHeader = header;
}

api.interceptors.request.use((config) => {
  if (cachedToken) {
    config.headers.Authorization = `Bearer ${cachedToken}`;
  } else if (serverCookieHeader) {
    config.headers.Cookie = serverCookieHeader;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retried?: boolean };
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retried) {
      originalRequest._retried = true;
      try {
        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        );
        const newAccessToken = refreshRes.data?.data?.accessToken;
        if (newAccessToken) {
          setCachedToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api.request(originalRequest);
        }
      } catch {
        // refresh failed — fall through to reject
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<ApiResult<T>> {
  try {
    const res = await api.request<T>(config);
    return { data: res.data, error: null, status: res.status };
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    const message =
      axiosErr.response?.data?.message ||
      axiosErr.message ||
      'Something went wrong. Please try again.';
    return { data: null, error: message, status: axiosErr.response?.status || 500 };
  }
}
