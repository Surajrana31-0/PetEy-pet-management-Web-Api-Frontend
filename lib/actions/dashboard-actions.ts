'use server';

import { dashboardApi } from '@/lib/api/dashboard';
import { notificationsApi } from '@/lib/api/notifications';
import { adoptionsApi } from '@/lib/api/adoptions';
import { extractApiError } from '@/lib/api/errors';
import type { IAdminDashboardData, INotification } from '@/lib/types';
import type { ActionResponse } from '@/lib/types/api';

export async function getAdminDashboardData(): Promise<
  ActionResponse & { data?: IAdminDashboardData }
> {
  try {
    const res = await dashboardApi.getFullDashboard();
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch dashboard data' };
    }
    return { success: true, message: res.message, data: res.data };
  } catch (err) {
    return { success: false, message: extractApiError(err, 'Failed to fetch dashboard data') };
  }
}

export async function getAdminDashboardOverview() {
  try {
    const res = await dashboardApi.getOverview();
    return res;
  } catch (err) {
    return null;
  }
}

export async function getAdminRecentActivities(limit = 10) {
  try {
    const res = await dashboardApi.getRecentActivities(limit);
    return res;
  } catch (err) {
    return null;
  }
}

export async function getMyNotifications(params?: {
  page?: number;
  limit?: number;
  unread?: boolean;
}): Promise<ActionResponse & { data?: INotification[]; unreadCount?: number }> {
  try {
    const res = await notificationsApi.getAll(params);
    return {
      success: res.success,
      message: res.message,
      data: res.data ?? undefined,
      unreadCount: res.meta?.unreadCount,
    };
  } catch (err) {
    return { success: false, message: extractApiError(err, 'Failed to fetch notifications') };
  }
}

export async function getUnreadNotificationCount(): Promise<ActionResponse & { count?: number }> {
  try {
    const res = await notificationsApi.getUnreadCount();
    return {
      success: res.success,
      message: res.message,
      count: res.data?.unreadCount,
    };
  } catch (err) {
    return { success: false, message: extractApiError(err, 'Failed to fetch unread count') };
  }
}

export async function markNotificationRead(id: string): Promise<ActionResponse> {
  try {
    const res = await notificationsApi.markAsRead(id);
    return { success: res.success, message: res.message };
  } catch (err) {
    return { success: false, message: extractApiError(err, 'Failed to mark notification as read') };
  }
}

export async function markAllNotificationsRead(): Promise<ActionResponse> {
  try {
    const res = await notificationsApi.markAllAsRead();
    return { success: res.success, message: res.message };
  } catch (err) {
    return { success: false, message: extractApiError(err, 'Failed to mark all as read') };
  }
}

export async function getUserDashboardData(): Promise<
  ActionResponse & {
    notifications?: INotification[];
    unreadCount?: number;
    myApplications?: unknown[];
  }
> {
  try {
    const [notifRes, appsRes] = await Promise.all([
      notificationsApi.getAll({ limit: 5 }),
      adoptionsApi.getMy({ limit: 5 }).catch(() => null),
    ]);

    return {
      success: true,
      message: 'Dashboard data retrieved',
      notifications: notifRes.data ?? [],
      unreadCount: notifRes.meta?.unreadCount ?? 0,
      myApplications: appsRes?.data ?? [],
    };
  } catch (err) {
    return { success: false, message: extractApiError(err, 'Failed to fetch dashboard data') };
  }
}
