import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * Resolve accessToken from server cookies or client document.cookie
 */
async function resolveToken(): Promise<string | null> {
  // Server-side: next/headers cookies()
  try {
    const { getTokenCookie } = await import("../cookies");
    const token = await getTokenCookie();
    if (token) return token;
  } catch {
    // Client-side fallback
  }

  // Client-side: document.cookie
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  }

  return null;
}

// Auto-inject Authorization Bearer and Cookie headers for every request
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await resolveToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["Cookie"] = `accessToken=${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global response error handler
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized API call:", error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
