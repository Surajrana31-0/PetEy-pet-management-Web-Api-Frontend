import { isAxiosError } from 'axios';
import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';

async function handleApiCall<T>(apiCall: () => Promise<{ data: T }>, fallbackMessage: string): Promise<T> {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || fallbackMessage);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(fallbackMessage);
  }
}

export const getAllAdminAppointments = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  veterinarianId?: string;
}) => {
  return handleApiCall(
    () => axiosInstance.get(ENDPOINTS.ADMIN.APPOINTMENTS.GET, { params }),
    'Failed to fetch appointments'
  );
};

export const updateAppointmentStatus = async (
  id: string,
  data: { status: string; adminNotes?: string; cancellationReason?: string }
) => {
  return handleApiCall(
    () => axiosInstance.patch(ENDPOINTS.ADMIN.APPOINTMENTS.UPDATE_STATUS(id), data),
    'Failed to update appointment status'
  );
};

export const deleteAppointment = async (id: string) => {
  return handleApiCall(
    () => axiosInstance.delete(ENDPOINTS.ADMIN.APPOINTMENTS.DELETE(id)),
    'Failed to delete appointment'
  );
};

export const getRecentAppointments = async (limit = 10) => {
  return handleApiCall(
    () => axiosInstance.get(ENDPOINTS.ADMIN.APPOINTMENTS.RECENT, { params: { limit } }),
    'Failed to fetch recent appointments'
  );
};

export const getAppointmentStatistics = async () => {
  return handleApiCall(
    () => axiosInstance.get(ENDPOINTS.ADMIN.APPOINTMENTS.STATS),
    'Failed to fetch appointment statistics'
  );
};
