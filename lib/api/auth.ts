// import axiosInstance from "./axios-instance";
import { axiosInstance } from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

export const register = async (data: any) => {
    try{
        const response = await axiosInstance.post(ENDPOINTS.AUTH.REGISTER, data);
        return response.data;
        // response.data -> response ko body
    }catch (error: any) {
        throw new Error(
            error?.response?.data?.message || 'Registration failed'
        );
    }
}
export const login = async (data: any)=>{
    try{
        const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, data);
        return response.data;
        // response.data -> response ko body
    }catch (error: any) {
        throw new Error(
            error?.response?.data?.message || 'Login failed'
        );
    }
}

export const whoami = async ()=>{
    try{
        const response = await axiosInstance.get(ENDPOINTS.AUTH.ME);
        return response.data;
        // response.data -> response ko body
    }catch (error: any) {
        throw new Error(
            error?.response?.data?.message || 'Fetch user info failed'
        );
    }
}

export const profileUpdate = async ( data: any) => {
    try{
        const response = await axiosInstance.put(
            ENDPOINTS.AUTH.UPDATE, 
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // for multer
                }
            }
        );
        return response.data;
        // response.data -> response ko body
    }catch (error: any) {
        throw new Error(
            error?.response?.data?.message || 'Profile update failed'
        );
    }

    
}

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axiosInstance.post(
            ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET,
            { email }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || 'Request password reset failed');
    }
}

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axiosInstance.post(
            ENDPOINTS.AUTH.RESET_PASSWORD(token),
            { newPassword: newPassword }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || 'Reset password failed');
    }

}