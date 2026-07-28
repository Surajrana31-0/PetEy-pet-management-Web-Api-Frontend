"use server";

import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";
const USER_DATA_COOKIE = "user_data";

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function setTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    ...COOKIE_BASE,
    maxAge: 15 * 60,
  });
}

export async function getTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function setRefreshTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(REFRESH_TOKEN_COOKIE, token, {
    ...COOKIE_BASE,
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function getRefreshTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export async function setUserInfoCookie(userInfo: unknown): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(USER_DATA_COOKIE, JSON.stringify(userInfo), {
    ...COOKIE_BASE,
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function getUserInfoCookie(): Promise<unknown> {
  const cookieStore = await cookies();
  const value = cookieStore.get(USER_DATA_COOKIE)?.value;
  return value ? JSON.parse(value) : null;
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(USER_DATA_COOKIE);
}
