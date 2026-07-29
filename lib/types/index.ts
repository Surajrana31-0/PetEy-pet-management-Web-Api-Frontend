import { UserRole } from './auth';

export { UserRole } from './auth';
export type { IUser, IUserPreferences, ILoginResponseData, ILoginPayload, IRegisterPayload } from './auth';

export type PetSpecies = 'DOG' | 'CAT';

export type PetStatus = 'AVAILABLE' | 'PENDING' | 'ADOPTED';

export interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  location?: string;
  role: UserRole;
  profileImage?: string | null;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}

export interface Pet {
  _id: string;
  name: string;
  age: number;
  breed: string;
  species: PetSpecies;
  description: string;
  emoji?: string;
  status: PetStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePetInput {
  name: string;
  age: number;
  breed: string;
  species: PetSpecies;
  description: string;
  emoji?: string;
  status?: PetStatus;
}

export interface UpdatePetInput extends Partial<CreatePetInput> {}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
}

export type NotificationType =
  | 'adoption_submitted'
  | 'adoption_approved'
  | 'adoption_rejected'
  | 'adoption_completed'
  | 'blog_published'
  | 'blog_unpublished'
  | 'user_suspended'
  | 'user_activated'
  | 'user_role_changed'
  | 'pet_created'
  | 'pet_archived'
  | 'system';

export interface INotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export type ActivityModule =
  | 'user'
  | 'pet'
  | 'adoption'
  | 'blog'
  | 'ai'
  | 'auth'
  | 'system';

export type ActivityAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'complete'
  | 'cancel'
  | 'suspend'
  | 'activate'
  | 'login'
  | 'register'
  | 'publish'
  | 'unpublish'
  | 'archive';

export interface IActivityLog {
  _id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  module: ActivityModule;
  action: ActivityAction;
  description: string;
  entityId?: string | null;
  entityType?: string | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminDashboardOverview {
  users: { total: number; admins: number; regular: number };
  pets: { total: number; available: number; adopted: number; pending: number };
  adoptions: { total: number; pending: number };
  blogs: { total: number };
}

export interface IMonthlyReportItem {
  _id: { year: number; month: number };
  total: number;
  completed?: number;
  approved?: number;
  rejected?: number;
  pending?: number;
}

export interface IMonthlyReports {
  adoptions: IMonthlyReportItem[];
  users: { _id: { year: number; month: number }; total: number }[];
  pets: { _id: { year: number; month: number }; total: number }[];
}

export interface IAdoptionTrends {
  statusCounts: { _id: string; count: number }[];
  speciesAdoption: { _id: string; count: number }[];
}

export interface IAdminDashboardData {
  overview: IAdminDashboardOverview;
  monthlyReports: IMonthlyReports;
  recentActivities: IActivityLog[];
  trends: IAdoptionTrends;
}

export interface IUserDashboardData {
  notifications: INotification[];
  unreadNotificationCount: number;
  myApplications: unknown[];
  favorites: unknown[];
}
