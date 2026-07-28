"use server";

import { cookies } from "next/headers";

/**
 * Cookie names must match the backend's `CookieUtil.setAuthCookies`
 * in `src/utils/cookies.ts` which sets `accessToken` and `refreshToken`.
 */
const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getTokenCookie() {
  const cookieStore = await cookies();

  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function setUserInfoCookie(userInfo: unknown) {
  const cookieStore = await cookies();

  cookieStore.set("user_data", JSON.stringify(userInfo), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getUserInfoCookie() {
  const cookieStore = await cookies();

  const value = cookieStore.get("user_data")?.value;

  return value ? JSON.parse(value) : null;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete("user_data");
}