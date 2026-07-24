import axios from "axios";
import { getTokenCookie } from "../cookies";
const BASE_URL = 
    process.env.NEXT_PUBLIC_API_URL 
    || "http://localhost:8088";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// Auto-inject Bearer token from local storage into the Authorization header for every request
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getTokenCookie();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Global response handeler - surface 401 to the console for now. In the future, we can redirect to login page or show a modal.
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized access - redirecting to login.");
        }
        return Promise.reject(error);
    }
);
export default axiosInstance;