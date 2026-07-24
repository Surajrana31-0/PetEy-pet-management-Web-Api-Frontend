// storage.ts — localStorage helpers for auth state
// Mirrors the cookie helpers from the reference frontend but uses localStorage
// because this is a SPA (no server-side rendering).

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'user_data';

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setUserInfo = (user: object): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserInfo = <T = Record<string, unknown>>(): T | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
