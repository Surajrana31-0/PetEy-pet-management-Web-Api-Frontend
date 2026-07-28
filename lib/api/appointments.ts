import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';
import { throwApiError } from './errors';
import type { IApiResponse } from '../types/api';
import type { IAppointment, IAppointmentPayload } from '../types/appointment';

export async function bookAppointment(data: IAppointmentPayload): Promise<IApiResponse<IAppointment>> {
  try {
    const response = await axiosInstance.post(ENDPOINTS.APPOINTMENTS.CREATE, data);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to book appointment');
  }
}

export async function getMyAppointments(params?: {
  page?: number;
  limit?: number;
}): Promise<IApiResponse<IAppointment[]>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.APPOINTMENTS.MY, { params });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch appointments');
  }
}

export async function getAppointmentById(id: string): Promise<IApiResponse<IAppointment>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.APPOINTMENTS.GET_ONE(id));
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch appointment');
  }
}

export async function cancelAppointment(
  id: string,
  cancellationReason?: string,
): Promise<IApiResponse<IAppointment>> {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.APPOINTMENTS.CANCEL(id), { cancellationReason });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to cancel appointment');
  }
}
