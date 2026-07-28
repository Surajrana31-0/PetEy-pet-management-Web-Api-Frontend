import { ENDPOINTS } from './endpoints';

export { ENDPOINTS };
export { default as axiosInstance, clearCachedToken } from './axios-instance';
export { ApiError, extractErrorMessage, throwApiError } from './errors';
export type { IApiResponse } from '../types/api';

export { petsApi, getAllPets, getPetById, getPetsByStatus, getPetsBySpecies, getPetsByBreed, getPetsByAge, getPetCategories } from './pets';
export { adoptionsApi } from './adoptions';
export { register, login, logout, whoami, profileUpdate, updatePassword, requestPasswordReset, resetPassword, verifyEmail } from './auth';
export { aiApi } from './ai';
export { bookAppointment, getMyAppointments, getAppointmentById, cancelAppointment } from './appointments';
export { getAllVets, getVetById } from './vets';
export { getAllUsers, getUserById, createUser, updateUser, deleteUser, updateUserRole, getUserStats } from './admin/users';
export { getAdminVets, getAdminVetStats, createVet, updateVet, toggleVetActive, deleteVet } from './admin/vets';
export { getAllAdminPets, getAdminPetById, createPet, updatePet, updatePetStatus, deletePet, getPetDashboardStats } from './admin/pets';
export { getAllBlogs, getBlogById, createBlog, updateBlog, updateBlogStatus, deleteBlog, getBlogStats } from './admin/blog';
export { getAllAdminAppointments, updateAppointmentStatus, deleteAppointment, getRecentAppointments, getAppointmentStatistics } from './admin/appointment';
