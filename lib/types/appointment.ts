export type AppointmentSpecies = 'DOG' | 'CAT';

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
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
}
