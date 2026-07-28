export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  profileImage?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  location?: string | null;
  role: UserRole;
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
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  fullName: string;
  email: string;
  password: string;
}
