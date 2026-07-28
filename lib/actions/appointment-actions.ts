'use server';

import { bookAppointment } from '@/lib/api/appointments';
import type { IAppointmentPayload } from '@/lib/types/appointment';

type ActionResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

export async function bookAppointmentAction(
  data: IAppointmentPayload,
): Promise<ActionResult> {
  try {
    const result = await bookAppointment(data);

    if (result.success) {
      return {
        success: true,
        message: result.message || 'Appointment booked successfully',
        data: result.data ?? undefined,
      };
    }

    return { success: false, message: result.message || 'Booking failed' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Booking failed',
    };
  }
}
