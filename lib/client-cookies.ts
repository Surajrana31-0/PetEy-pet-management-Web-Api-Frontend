'use client';

export function clearClientCookies(): void {
  ['accessToken', 'refreshToken'].forEach((name) => {
    document.cookie = `${name}=; path=/; max-age=0; samesite=strict`;
  });
}
