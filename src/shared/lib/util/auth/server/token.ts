'use server';

import { cookies } from 'next/headers';
import { setCookies } from '@/shared/lib/util';
import { refreshToken } from '@/features/login/api';

export type RefreshResult = {
  accessToken: string;
  accessTokenExpireDate: number;
};

const BASE_URL = process.env.BASE_URL ?? '';

export async function refreshAccessToken(): Promise<{
  result: RefreshResult;
  setCookieHeader?: string;
}> {
  const res = await refreshToken();
  if (!res.ok) {
    throw new Error('Failed to refresh token');
  }
  const setCookieHeader = res.headers?.get('set-cookie') || res.headers?.get('Set-Cookie') || undefined;
  return { result: res.data, setCookieHeader };
}

export async function fetchNextAuthCsrfToken(cookieHeader?: string): Promise<string> {
  const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`, {
    method: 'GET',
    headers: {
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    credentials: 'include',
  });
  if (!csrfResponse.ok) {
    throw new Error('Failed to fetch CSRF token');
  }
  const { csrfToken } = await csrfResponse.json();
  return csrfToken as string;
}

export async function updateNextAuthSession(params: {
  accessToken: string;
  accessTokenExpireDate: number;
  cookieHeader?: string;
  csrfToken: string;
}): Promise<{ setCookieHeader?: string }> {
  const { accessToken, accessTokenExpireDate, cookieHeader, csrfToken } = params;
  const refreshRes = await fetch(`${BASE_URL}/api/auth/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    },
    body: JSON.stringify({
      csrfToken,
      data: { accessToken, accessTokenExpireDate },
    }),
    credentials: 'include',
  });
  const setCookieHeader = refreshRes.headers.get('set-cookie') || refreshRes.headers.get('Set-Cookie') || undefined;
  return { setCookieHeader };
}

export async function applySetCookieHeader(setCookieHeader?: string) {
  if (!setCookieHeader) return;
  await setCookies(setCookieHeader);
}

export async function getCurrentCookieHeader(): Promise<string | undefined> {
  const cookieHeader = (await cookies()).toString();
  return cookieHeader || undefined;
}
