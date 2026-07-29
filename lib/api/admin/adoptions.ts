import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import { throwApiError } from '../errors';
import type { IApiResponse } from '../../types/api';

export interface IBulkActionResponse {
  id: string;
  success: boolean;
  status?: string;
  error?: string;
}

export const adminAdoptionsApi = {
  getStats: async (): Promise<IApiResponse<{ total: number; statusCounts: { _id: string; count: number }[] }>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.ADOPTIONS.STATS);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch adoption stats');
    }
  },

  exportCsv: async (status?: string): Promise<Blob> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.ADOPTIONS.EXPORT, {
        params: status ? { status } : undefined,
        responseType: 'blob',
      });
      return response.data as Blob;
    } catch (error) {
      throwApiError(error, 'Failed to export adoption data');
    }
  },

  getByStatus: async (
    status: string,
    params?: { page?: number; limit?: number },
  ): Promise<IApiResponse<unknown[]>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.ADOPTIONS.BY_STATUS(status), { params });
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch applications by status');
    }
  },

  bulkApprove: async (
    applicationIds: string[],
    adminNotes?: string,
  ): Promise<IApiResponse<IBulkActionResponse[]>> => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.ADMIN.ADOPTIONS.BULK_APPROVE, {
        applicationIds,
        adminNotes,
      });
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to bulk approve applications');
    }
  },

  bulkReject: async (
    applicationIds: string[],
    adminNotes?: string,
  ): Promise<IApiResponse<IBulkActionResponse[]>> => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.ADMIN.ADOPTIONS.BULK_REJECT, {
        applicationIds,
        adminNotes,
      });
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to bulk reject applications');
    }
  },
};
