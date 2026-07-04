"use server";

import { cookies } from "next/headers";

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getTokenCookie() {
  const cookieStore = await cookies();

  return cookieStore.get("auth_token")?.value ?? null;
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

  cookieStore.delete("auth_token");
  cookieStore.delete("user_data");
}