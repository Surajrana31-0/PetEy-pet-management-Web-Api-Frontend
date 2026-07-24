import { getTokenCookie } from '../cookies';

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getTokenCookie();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
