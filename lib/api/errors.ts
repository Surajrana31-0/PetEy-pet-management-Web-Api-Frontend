import { isAxiosError, type AxiosError } from 'axios';

export class ApiError extends Error {
  statusCode: number;
  isApiError = true;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    return axiosErr.response?.data?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export function throwApiError(error: unknown, fallback: string): never {
  throw new ApiError(extractErrorMessage(error, fallback),
    isAxiosError(error) ? error.response?.status ?? 500 : 500);
}

export function extractApiError(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    if (axiosErr.response?.data?.message) return axiosErr.response.data.message;
    if (axiosErr.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
    if (!axiosErr.response) return 'Cannot reach the server. Please check your connection.';
    return fallback;
  }
  if (error instanceof Error) return error.message || fallback;
  return fallback;
}
