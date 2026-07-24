// import { whoami } from '../api/auth';
// import { clearAuthCookies, setUserInfoCookie } from '../cookies';
// import type { IUser } from '../types/auth';

// export async function getCurrentUser(): Promise<IUser | null> {
//   try {
//     const response = await whoami();
//     if (response.success && response.data) {
//       await setUserInfoCookie(response.data);
//       return response.data;
//     }
//     await clearAuthCookies();
//     return null;
//   } catch {
//     await clearAuthCookies();
//     return null;
//   }
// }


import { whoami } from "../api/auth";
import { setUserInfoCookie } from "../cookies";
import type { IUser } from "../types/auth";

export async function getCurrentUser(): Promise<IUser | null> {
  try {
    const response = await whoami();

    if (response.success && response.data) {
      // We'll discuss this line next
      await setUserInfoCookie(response.data);

      return response.data;
    }

    return null;
  } catch {
    return null;
  }
}