import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';
import { throwApiError } from './errors';
import type { IApiResponse } from '../types/api';
import type {
  IAdminDashboardData,
  IAdminDashboardOverview,
  IMonthlyReports,
  IActivityLog,
  IAdoptionTrends,
} from '../types';

export const dashboardApi = {
  getFullDashboard: async (): Promise<IApiResponse<IAdminDashboardData>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.DASHBOARD.FULL);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch dashboard data');
    }
  },

  getOverview: async (): Promise<IApiResponse<IAdminDashboardOverview>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.DASHBOARD.OVERVIEW);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch dashboard overview');
    }
  },

  getMonthlyReports: async (months?: number): Promise<IApiResponse<IMonthlyReports>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.DASHBOARD.MONTHLY_REPORTS, {
        params: months ? { months } : undefined,
      });
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch monthly reports');
    }
  },

  getRecentActivities: async (limit?: number): Promise<IApiResponse<IActivityLog[]>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.DASHBOARD.RECENT_ACTIVITIES, {
        params: limit ? { limit } : undefined,
      });
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch recent activities');
    }
  },

  getActivityLogs: async (params?: {
    page?: number;
    limit?: number;
    module?: string;
    action?: string;
    actorId?: string;
  }): Promise<IApiResponse<IActivityLog[]>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.DASHBOARD.ACTIVITY_LOGS, { params });
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch activity logs');
    }
  },

  getActivityStats: async (): Promise<IApiResponse<Record<string, unknown>>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.DASHBOARD.ACTIVITY_STATS);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch activity stats');
    }
  },

  getAdoptionTrends: async (): Promise<IApiResponse<IAdoptionTrends>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.DASHBOARD.ADOPTION_TRENDS);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch adoption trends');
    }
  },
};
