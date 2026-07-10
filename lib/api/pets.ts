// import { getCookieHeader } from '../cookies';
import { getTokenCookie } from '../cookies';
import type { IBackendResponse } from '../types/auth';
import type { ICreatePetPayload, IPet, IUpdatePetPayload, PetStatus } from '../types/pet';
import { axiosInstance } from './axios-instance';
import { ENDPOINTS } from './endpoints';

export const petsApi = {
  getAll: async (status?: PetStatus): Promise<IBackendResponse<IPet[]>> => {
    const response = await axiosInstance.get<IBackendResponse<IPet[]>>(ENDPOINTS.PETS.GET, {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  getById: async (id: string): Promise<IBackendResponse<IPet>> => {
    const response = await axiosInstance.get<IBackendResponse<IPet>>(`${ENDPOINTS.PETS.GET_ONE(id)}`);
    return response.data;
  },

  create: async (data: ICreatePetPayload): Promise<IBackendResponse<IPet>> => {
    const token = await getTokenCookie();
    const response = await axiosInstance.post<IBackendResponse<IPet>>(ENDPOINTS.ADMIN.PETS.CREATE, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  update: async (id: string, data: IUpdatePetPayload): Promise<IBackendResponse<IPet>> => {
    const token = await getTokenCookie();
    const response = await axiosInstance.put<IBackendResponse<IPet>>(`${ENDPOINTS.ADMIN.PETS.UPDATE(id)}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  delete: async (id: string): Promise<IBackendResponse<null>> => {
    const token = await getTokenCookie();
    const response = await axiosInstance.delete<IBackendResponse<null>>(`${ENDPOINTS.ADMIN.PETS.DELETE(id)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },
};
