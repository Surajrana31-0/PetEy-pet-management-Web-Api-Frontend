import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';

export const getAllBlogs = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.BLOGS.GET, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch blogs');
  }
};

export const getBlogById = async (id: string) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.BLOGS.GET_ONE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch blog');
  }
};

export const createBlog = async (data: FormData | { title: string; content: string; status?: string; coverImage?: string }) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.post(ENDPOINTS.ADMIN.BLOGS.CREATE, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create blog');
  }
};

export const updateBlog = async (id: string, data: FormData | Record<string, unknown>) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.put(ENDPOINTS.ADMIN.BLOGS.UPDATE(id), data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update blog');
  }
};

export const updateBlogStatus = async (id: string, status: 'DRAFT' | 'PUBLISHED') => {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.ADMIN.BLOGS.UPDATE_STATUS(id), { status });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update blog status');
  }
};

export const deleteBlog = async (id: string) => {
  try {
    const response = await axiosInstance.delete(ENDPOINTS.ADMIN.BLOGS.DELETE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to delete blog');
  }
};

export const getBlogStats = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.BLOGS.STATS);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch blog stats');
  }
};


