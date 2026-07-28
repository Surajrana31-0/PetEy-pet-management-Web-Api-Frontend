"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axiosInstance from '@/lib/api/axios-instance';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { clearCachedToken } from '@/lib/api/axios-instance';
import type { IUser } from '@/lib/types/auth';

interface AuthContextValue {
  user: IUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
  clearUser: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refetch: async () => {},
  clearUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.AUTH.ME);
      if (response.data?.success) {
        setUser(response.data.data ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const clearUser = useCallback(() => {
    setUser(null);
    clearCachedToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetch: fetchUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export { AuthContext };
