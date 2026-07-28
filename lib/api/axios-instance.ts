import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ENDPOINTS } from './endpoints';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088';

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 30_000,
});

let cachedToken: string | null = null;
let tokenFetchPromise: Promise<string | null> | null = null;

async function resolveToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;

  if (tokenFetchPromise) return tokenFetchPromise;

  tokenFetchPromise = (async () => {
    try {
      const { getTokenCookie } = await import('../cookies');
      const token = await getTokenCookie();
      if (token) {
        cachedToken = token;
        return token;
      }
    } catch {
      // Client-side fallback below
    }

    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
      if (match && match[1]) {
        const token = decodeURIComponent(match[1]);
        cachedToken = token;
        return token;
      }
    }

    return null;
  })();

  try {
    return await tokenFetchPromise;
  } finally {
    tokenFetchPromise = null;
  }
}

export function clearCachedToken(): void {
  cachedToken = null;
}

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await resolveToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

async function attemptTokenRefresh(): Promise<string | null> {
  try {
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)refreshToken=([^;]*)/);
      if (!match) return null;

      const res = await axios.post(
        `${BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`,
        { refreshToken: decodeURIComponent(match[1]) },
        { headers: { 'Content-Type': 'application/json' } },
      );

      if (res.data?.success && res.data?.data?.accessToken) {
        cachedToken = res.data.data.accessToken;
        document.cookie = `accessToken=${res.data.data.accessToken}; path=/; max-age=900; SameSite=Lax`;
        document.cookie = `refreshToken=${res.data.data.refreshToken}; path=/; max-age=604800; SameSite=Lax`;
        return res.data.data.accessToken;
      }
    }
  } catch {
    // Refresh failed — user will need to log in again
  }
  return null;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await attemptTokenRefresh();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }

      if (typeof window !== 'undefined') {
        clearCachedToken();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
