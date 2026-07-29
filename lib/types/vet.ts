export type WeekDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface IAvailabilitySlot {
  day: WeekDay;
  startTime: string;
  endTime: string;
}

export interface IVeterinarian {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  specializations: string[];
  location?: string;
  profileImage?: string | null;
  experienceYears?: number;
  consultationFee: number;
  rating: number;
  reviewCount?: number;
  about?: string;
  availability: IAvailabilitySlot[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateVetPayload {
  name: string;
  email: string;
  phone: string;
  specializations: string[];
  location: string;
  profileImage?: string;
  experienceYears?: number;
  consultationFee: number;
  rating?: number;
  availability: IAvailabilitySlot[];
  isActive?: boolean;
}

export type IUpdateVetPayload = Partial<ICreateVetPayload>;
