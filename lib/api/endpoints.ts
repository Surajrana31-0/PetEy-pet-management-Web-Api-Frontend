export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me',
    UPDATE: '/api/v1/auth/update',
    REQUEST_PASSWORD_RESET: '/api/v1/auth/request-password-reset',
    RESET_PASSWORD: (token: string) => `/api/v1/auth/reset-password/${token}`,
  },
  PETS:{
    GET: '/api/v1/pets',
    GET_ONE: (id: string) => `/api/v1/pets/${id}`,
    UPDATE: (id: string) => `/api/v1/pets/${id}`,
    DELETE: (id: string) => `/api/v1/pets/${id}`,
  },
  ADMIN: {
    BLOGS: {
      GET: "/api/v1/admin/blogs",
      GET_ONE: (id: string) => `/api/v1/admin/blogs/${id}`,
      CREATE: "/api/v1/admin/blogs",
      UPDATE: (id: string): string => `/api/v1/admin/blogs/${id}`,
      DELETE: (id: string): string => `/api/v1/admin/blogs/${id}`,
    },
    USERS: {
      GET: "/api/v1/admin/users",
      GET_ONE: (id: string) => `/api/v1/admin/users/${id}`,
      CREATE: "/api/v1/admin/users",
      UPDATE: (id: string): string => `/api/v1/admin/users/${id}`,
      DELETE: (id: string): string => `/api/v1/admin/users/${id}`,
    },
    PETS: {
      GET: '/api/v1/pets',
      GET_ONE: (id: string) => `/api/v1/pets/${id}`,
      CREATE: '/api/v1/pets',
      UPDATE: (id: string) => `/api/v1/pets/${id}`,
      DELETE: (id: string) => `/api/v1/pets/${id}`,
    }
  }
}
