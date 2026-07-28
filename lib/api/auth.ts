import { apiRequest } from './axios-instance';
import { ENDPOINTS } from './endpoints';
import type { User, AuthResponse } from '@/lib/types';

export const authApi = {
  register: (body: { fullName: string; email: string; password: string }) =>
    apiRequest<AuthResponse>({ method: 'POST', url: ENDPOINTS.AUTH.REGISTER, data: body }),

  login: (body: { email: string; password: string }) =>
    apiRequest<AuthResponse>({ method: 'POST', url: ENDPOINTS.AUTH.LOGIN, data: body }),

  logout: () => apiRequest<{ success: boolean }>({ method: 'POST', url: ENDPOINTS.AUTH.LOGOUT }),

  me: () => apiRequest<User>({ method: 'GET', url: ENDPOINTS.AUTH.ME }),
};
