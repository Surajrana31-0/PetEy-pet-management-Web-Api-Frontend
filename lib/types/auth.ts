export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IUserPreferences {
  petType: string[];
  size: ('SMALL' | 'MEDIUM' | 'LARGE')[];
  age?: string | null;
  activityLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | null;
  experience?: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERIENCED' | null;
  hasChildren: boolean;
  hasOtherPets: boolean;
}

export interface IUser {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  profileImage?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  location?: string | null;
  role: UserRole;
  preferences?: IUserPreferences;
  favorites?: string[];
  emailVerified?: boolean;
  tokenVersion?: number;
  isSuspended?: boolean;
  suspensionReason?: string | null;
  suspendedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IBackendResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface ILoginResponseData {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface IAuthActionResponse {
  success: boolean;
  message?: string;
  error?: string;
  redirectTo?: string;
  data?: ILoginResponseData;
}

export type ActionResponse = {
  success: boolean;
  message?: string;
  data?: ILoginResponseData;
};

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}
