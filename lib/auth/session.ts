import { getUserInfoCookie, getTokenCookie } from "../cookies";
import { decodeAccessTokenRole } from "./roles";
import type { IUser } from "../types/auth";

export async function getCurrentUser(): Promise<IUser | null> {
  try {
    // 1. Check if token exists first
    const token = await getTokenCookie();
    if (!token) return null;
    
    // 2. Validate token structure
    const role = decodeAccessTokenRole(token);
    if (!role) return null;

    // 3. Return user data from cookie
    const userData = await getUserInfoCookie();
    if (userData) {
      return userData as IUser;
    }

    return null;
  } catch {
    return null;
  }
}
