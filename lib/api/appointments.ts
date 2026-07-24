import axiosInstance from './axios-instance';
import { ENDPOINTS } from './endpoints';

export const bookAppointment = async (data: {
  veterinarianId: string;
  petName: string;
  petSpecies: 'DOG' | 'CAT';
  appointmentDate: string;
  timeSlot: string; // "HH:mm-HH:mm"
  reason: string;
}) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.APPOINTMENTS.CREATE, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to book appointment');
  }
};

export const getMyAppointments = async (params?: { page?: number; limit?: number }) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.APPOINTMENTS.MY, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch appointments');
  }
};

export const getAppointmentById = async (id: string) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.APPOINTMENTS.GET_ONE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch appointment');
  }
};

export const cancelAppointment = async (id: string, cancellationReason?: string) => {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.APPOINTMENTS.CANCEL(id), {
      cancellationReason,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to cancel appointment');
  }
};

