import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './endpoints';
import type { ApiErrorResponse } from '@/lib/types';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<ApiResult<T>> {
  try {
    const res = await api.request<T>(config);
    return { data: res.data, error: null, status: res.status };
  } catch (err) {
    const axiosErr = err as AxiosError<ApiErrorResponse>;
    const message =
      axiosErr.response?.data?.message ||
      axiosErr.message ||
      'Something went wrong. Please try again.';
    return { data: null, error: message, status: axiosErr.response?.status || 500 };
  }
}

export function isApiSuccess<T>(r: ApiResult<T>): r is ApiResult<T> & { data: T; error: null } {
  return r.data !== null && r.error === null;
}
