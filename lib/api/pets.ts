import { getCookieHeader } from '../cookies';
import type { IBackendResponse } from '../types/auth';
import type { ICreatePetPayload, IPet, IUpdatePetPayload, PetStatus } from '../types/pet';
import { axiosInstance } from './axios-instance';
import { ENDPOINTS } from './endpoints';

export const petsApi = {
  getAll: async (status?: PetStatus): Promise<IBackendResponse<IPet[]>> => {
    const response = await axiosInstance.get<IBackendResponse<IPet[]>>(ENDPOINTS.PETS, {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  getById: async (id: string): Promise<IBackendResponse<IPet>> => {
    const response = await axiosInstance.get<IBackendResponse<IPet>>(`${ENDPOINTS.PETS}/${id}`);
    return response.data;
  },

  create: async (data: ICreatePetPayload): Promise<IBackendResponse<IPet>> => {
    const cookieHeader = await getCookieHeader();
    const response = await axiosInstance.post<IBackendResponse<IPet>>(ENDPOINTS.PETS, data, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
    });
    return response.data;
  },

  update: async (id: string, data: IUpdatePetPayload): Promise<IBackendResponse<IPet>> => {
    const cookieHeader = await getCookieHeader();
    const response = await axiosInstance.put<IBackendResponse<IPet>>(`${ENDPOINTS.PETS}/${id}`, data, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
    });
    return response.data;
  },

  delete: async (id: string): Promise<IBackendResponse<null>> => {
    const cookieHeader = await getCookieHeader();
    const response = await axiosInstance.delete<IBackendResponse<null>>(`${ENDPOINTS.PETS}/${id}`, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
    });
    return response.data;
  },
};
