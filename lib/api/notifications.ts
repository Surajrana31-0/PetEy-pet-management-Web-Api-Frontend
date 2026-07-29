import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';
import { throwApiError } from './errors';
import type { IApiResponse } from '../types/api';
import type { INotification } from '../types';

export const notificationsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    unread?: boolean;
  }): Promise<IApiResponse<INotification[]>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.NOTIFICATIONS.BASE, { params });
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch notifications');
    }
  },

  getUnreadCount: async (): Promise<IApiResponse<{ unreadCount: number }>> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to fetch unread count');
    }
  },

  markAsRead: async (id: string): Promise<IApiResponse<INotification>> => {
    try {
      const response = await axiosInstance.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to mark notification as read');
    }
  },

  markAllAsRead: async (): Promise<IApiResponse<{ message: string }>> => {
    try {
      const response = await axiosInstance.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to mark all notifications as read');
    }
  },

  delete: async (id: string): Promise<IApiResponse<{ message: string }>> => {
    try {
      const response = await axiosInstance.delete(ENDPOINTS.NOTIFICATIONS.BY_ID(id));
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to delete notification');
    }
  },

  deleteAllRead: async (): Promise<IApiResponse<{ message: string; count: number }>> => {
    try {
      const response = await axiosInstance.delete(ENDPOINTS.NOTIFICATIONS.DELETE_READ);
      return response.data;
    } catch (error) {
      throwApiError(error, 'Failed to delete read notifications');
    }
  },
};
