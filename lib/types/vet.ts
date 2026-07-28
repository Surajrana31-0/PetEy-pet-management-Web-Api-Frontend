export interface IAvailability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface IVeterinarian {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  specialization?: string | null;
  licenseNumber?: string | null;
  experience?: number | null;
  clinicAddress?: string | null;
  availability?: IAvailability[];
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}
