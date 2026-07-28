import axiosInstance from '../axios-instance';
import { ENDPOINTS } from '../endpoints';
import { throwApiError } from '../errors';
import type { IApiResponse } from '../../types/api';

export interface IBlog {
  _id: string;
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED';
  coverImage?: string | null;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAllBlogs(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<IApiResponse<IBlog[]>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.BLOGS.GET, { params });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch blogs');
  }
}

export async function getBlogById(id: string): Promise<IApiResponse<IBlog>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.BLOGS.GET_ONE(id));
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch blog');
  }
}

export async function createBlog(
  data: FormData | { title: string; content: string; status?: string; coverImage?: string },
): Promise<IApiResponse<IBlog>> {
  try {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.post(ENDPOINTS.ADMIN.BLOGS.CREATE, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to create blog');
  }
}

export async function updateBlog(
  id: string,
  data: FormData | Record<string, unknown>,
): Promise<IApiResponse<IBlog>> {
  try {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.put(ENDPOINTS.ADMIN.BLOGS.UPDATE(id), data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to update blog');
  }
}

export async function updateBlogStatus(
  id: string,
  status: 'DRAFT' | 'PUBLISHED',
): Promise<IApiResponse<IBlog>> {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.ADMIN.BLOGS.UPDATE_STATUS(id), { status });
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to update blog status');
  }
}

export async function deleteBlog(id: string): Promise<IApiResponse<null>> {
  try {
    const response = await axiosInstance.delete(ENDPOINTS.ADMIN.BLOGS.DELETE(id));
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to delete blog');
  }
}

export async function getBlogStats(): Promise<IApiResponse<Record<string, number>>> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN.BLOGS.STATS);
    return response.data;
  } catch (error) {
    throwApiError(error, 'Failed to fetch blog stats');
  }
}
