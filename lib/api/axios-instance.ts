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
  if (typeof window !== 'undefined') {
    document.cookie = 'accessToken=; path=/; max-age=0; samesite=lax';
  }
}

let serverCookieHeader: string | null = null;

export async function setServerCookieHeader(header: string | null): Promise<void> {
  serverCookieHeader = header;
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

api.interceptors.request.use((config) => {
  if (cachedToken) {
    config.headers.Authorization = `Bearer ${cachedToken}`;
  } else if (typeof window !== 'undefined') {
    const clientToken = getCookieValue('accessToken');
    if (clientToken) {
      config.headers.Authorization = `Bearer ${clientToken}`;
    }
  } else if (serverCookieHeader) {
    config.headers.Cookie = serverCookieHeader;
  }
  return config;
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      let refreshToken: string | null = null;

      if (typeof window !== 'undefined') {
        refreshToken = getCookieValue('refreshToken');
      } else if (serverCookieHeader) {
        const match = serverCookieHeader.match(/refreshToken=([^;]*)/);
        refreshToken = match ? match[1] : null;
      }

      const res = await axios.post(
        `${API_BASE_URL}/auth/refresh-token`,
        { refreshToken },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      const newToken = res.data?.data?.accessToken;
      if (newToken) {
        setCachedToken(newToken);
        if (typeof window !== 'undefined') {
          document.cookie = `accessToken=${newToken}; path=/; max-age=3600; samesite=lax`;
        }
        return newToken;
      }
      return null;
    } catch {
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retried?: boolean };
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retried && !originalRequest.url?.includes('/auth/')) {
      originalRequest._retried = true;
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
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
