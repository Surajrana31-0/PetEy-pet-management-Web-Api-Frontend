export type AppointmentSpecies = 'DOG' | 'CAT';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface IAppointmentPayload {
  veterinarianId: string;
  petName: string;
  petSpecies: AppointmentSpecies;
  appointmentDate: string;
  timeSlot: string;
  reason: string;
}

export interface IAppointment {
  _id: string;
  veterinarianId: string;
  userId: string;
  petName: string;
  petSpecies: AppointmentSpecies;
  appointmentDate: string;
  timeSlot: string;
  reason: string;
  status: AppointmentStatus;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
}
