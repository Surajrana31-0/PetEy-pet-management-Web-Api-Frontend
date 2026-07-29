import { setCachedToken } from './axios-instance';

export async function getAuthHeaders(): Promise<Record<string, string>> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) setCachedToken(token);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
}
