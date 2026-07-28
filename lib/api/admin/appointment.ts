import { isAxiosError, type AxiosError } from 'axios';
import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import type { IApiResponse } from '../../types/api';
import type { IAppointment } from '../../types/appointment';

async function handleApiCall<T>(
  apiCall: () => Promise<{ data: T }>,
  fallbackMessage: string,
): Promise<T> {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const axiosErr = error as AxiosError<{ message?: string }>;
      throw new Error(axiosErr.response?.data?.message || fallbackMessage);
    }
    if (error instanceof Error) throw error;
    throw new Error(fallbackMessage);
  }
}

export async function getAllAdminAppointments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  veterinarianId?: string;
}): Promise<IApiResponse<IAppointment[]>> {
  return handleApiCall(
    () => axiosInstance.get(ENDPOINTS.ADMIN.APPOINTMENTS.GET, { params }),
    'Failed to fetch appointments',
  );
}

export async function updateAppointmentStatus(
  id: string,
  data: { status: string; adminNotes?: string; cancellationReason?: string },
): Promise<IApiResponse<IAppointment>> {
  return handleApiCall(
    () => axiosInstance.patch(ENDPOINTS.ADMIN.APPOINTMENTS.UPDATE_STATUS(id), data),
    'Failed to update appointment status',
  );
}

export async function deleteAppointment(id: string): Promise<IApiResponse<null>> {
  return handleApiCall(
    () => axiosInstance.delete(ENDPOINTS.ADMIN.APPOINTMENTS.DELETE(id)),
    'Failed to delete appointment',
  );
}

export async function getRecentAppointments(limit = 10): Promise<IApiResponse<IAppointment[]>> {
  return handleApiCall(
    () => axiosInstance.get(ENDPOINTS.ADMIN.APPOINTMENTS.RECENT, { params: { limit } }),
    'Failed to fetch recent appointments',
  );
}

export async function getAppointmentStatistics(): Promise<IApiResponse<Record<string, number>>> {
  return handleApiCall(
    () => axiosInstance.get(ENDPOINTS.ADMIN.APPOINTMENTS.STATS),
    'Failed to fetch appointment statistics',
  );
}
