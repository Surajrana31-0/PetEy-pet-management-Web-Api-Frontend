import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';
import { throwApiError } from './errors';
import type { IApiResponse } from '../types/api';

export interface IChatSession {
  _id: string;
  userId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export const chatSessionsApi = {
  getSessions: async (): Promise<IApiResponse<IChatSession[]>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.AI.SESSIONS);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch chat sessions');
    }
  },

  deleteSession: async (sessionId: string): Promise<IApiResponse<null>> => {
    try {
      const response = await axiosInstance.delete(ENDPOINTS.AI.SESSION_BY_ID(sessionId));
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to delete chat session');
    }
  },
};
