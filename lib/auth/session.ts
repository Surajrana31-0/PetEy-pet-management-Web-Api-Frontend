
import { whoami } from "../api/auth";
// import { setUserInfoCookie } from "../cookies";
import type { IUser } from "../types/auth";

export async function getCurrentUser(): Promise<IUser | null> {
  try {
    const response = await whoami();

    if (response.success && response.data) {
      // We'll discuss this line next
      // await setUserInfoCookie(response.data);

      return response.data;
    }

    return null;
  } catch (error) {
    // TEMP DEBUG — remove once the 401 cause is confirmed
    console.error('[getCurrentUser] Error fetching current user', error instanceof Error ? error.message : error);
    return null;
  }
}