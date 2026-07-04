"use server";  // from frontend server
import { register, login, whoami, profileUpdate, resetPassword, requestPasswordReset } from "@/lib/api/auth";
import { setUserInfoCookie, setTokenCookie } from "../cookies";
import { revalidatePath } from "next/cache";
import { LoginFormData, RegisterFormData } from "@/app/(auth)/_components/schemas";

export async function registerUser(data: RegisterFormData) {
    try {
        const result = await register(data);
        // how to send data to component
        if (result.success) {
            return {
                success: true, data: result.data,
                message: result.message || 'Registration successful'
            };
        }
        return {
            success: false, message: result.message
                || 'Registration failed'
        };
    } catch (error: any) {
        return { success: false, message: error.message || 'Registration failed' };
    }
}
export async function loginUser(data: LoginFormData) {
    try {
        const result = await login(data);
        // how to send data to component
        if (result.success) {
            // cookie implementation 
            const user = result.data?.user;
            const token = result.data?.token;
            await setUserInfoCookie(user);
            await setTokenCookie(token);

            return {
                success: true, data: result.data,
                message: result.message || 'Login successful'
            };
        }
        return {
            success: false, message: result.message
                || 'Login failed'
        };
    } catch (error: any) {
        return { success: false, message: error.message || 'Login failed' };
    }
}

export async function getUserData() {
    try {
        const result = await whoami();
        // how to send data to component
        if (result.success) {
            return {
                success: true, data: result.data,
                message: result.message || 'Fetch user info successful'
            };
        }
        return {
            success: false, message: result.message
                || 'Fetch user info failed'
        };
    } catch (error: any) {
        return { success: false, message: error.message || 'Fetch user info failed' };
    }
}


export async function handleUpdateProfile(data: FormData) {
    try {
        const result = await profileUpdate(data);
        if (result.success) {
            revalidatePath("/dashboard/update-profile"); // update data
            return {
                success: true, data: result.data,
                message: result.message || 'Profile update successful'
            };
        }
        return {
            success: false, message: result.message
                || 'Profile update failed'
        };
    } catch (error: any) {
        return { success: false, message: error.message || 'Profile update failed' };
    }

}

 export const handleRequestPasswordReset = async (email: string) => {
    try{
        const result = await requestPasswordReset(email);
        if(result.success){
            return { success: true, message: result.message };
        }else{
            return { success: false, message: result.message || 'Request password reset failed' };    
        }
    }catch (error: Error | any){
        return { success: false, message: error?.message || 'Request password reset failed' };
    }
}

export const handleResetPassword = async (token: string, newPassword: string) => {
    try{
        const result = await resetPassword(token, newPassword);
        if(result.success){
            return { success: true, message: result.message };
        }else{
            return { success: false, message: result.message || 'Reset password failed' };    
        }
    }catch (error: Error | any){
        return { success: false, message: error?.message || 'Reset password failed' };
    }
} 