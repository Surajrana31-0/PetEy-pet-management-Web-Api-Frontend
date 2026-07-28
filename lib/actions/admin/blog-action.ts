"use server";
import { revalidatePath } from "next/cache";
import { deleteBlog, getAllBlogs } from "@/lib/api/admin/blog";
export async function handleGetAllBlogs(params: {
    page?: number;
    limit?: number;
    search?: string;
}) {
    try {
        const currentPage = params.page || 1;
        const pageSize = params.limit || 10;
        const searchQuery = params.search || '';

        const response = await getAllBlogs({
            page: currentPage,
            limit: pageSize,
            search: searchQuery
        });
        if (response.success) {
            return {
                success: true,
                data: response.data,
                pagination: response.meta // meta contains pagination info like total pages, current page, etc.
            }
        }
        return { success: false, data: [], pagination: null };
    } catch (err: any) {
        throw new Error(
            err.message || "Failed to get blogs"
        );
    }
}

export const handleDeleteBlog = async (id: string) => {
    try {
        const response = await deleteBlog(id);
        if (response.success) {
            revalidatePath('/admin/blogs'); // Revalidate the blogs page after deletion
            return { success: true, message: "Blog deleted successfully" };
        }
        return { success: false, message: "Failed to delete blog" };
    } catch (err: any) {
        return ({ success: false, message: err.message || "Failed to delete blog" });
    }
}