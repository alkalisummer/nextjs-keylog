'use server';

import { client } from '@/shared/lib/client';
import { refreshAccessToken as createAccessToken } from '@/features/login/api';

export type RefreshResult = {
  accessToken: string;
  accessTokenExpireDate: number;
};

export async function refreshAccessToken(): Promise<{
  result: RefreshResult;
  setCookieHeader?: string;
}> {
  const res = await createAccessToken();
  if (!res.ok) {
    throw new Error('Failed to refresh token');
  }
  const setCookieHeader = res.headers?.get('set-cookie') || res.headers?.get('Set-Cookie') || undefined;
  return { result: res.data, setCookieHeader };
}

export async function fetchNextAuthCsrfToken(cookieHeader?: string): Promise<string> {
  const csrfResponse = await client.route().get({
    endpoint: '/auth/csrf',
    options: {
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      isPublic: true,
    },
  });

  if (!csrfResponse.ok) {
    throw new Error('Failed to fetch CSRF token');
  }

  const { csrfToken } = csrfResponse.data as { csrfToken: string };

  return csrfToken;
}

export async function updateNextAuthSession(params: {
  accessToken: string;
  accessTokenExpireDate: number;
  cookieHeader?: string;
  csrfToken: string;
}): Promise<{ setCookieHeader?: string }> {
  const { accessToken, accessTokenExpireDate, cookieHeader, csrfToken } = params;
  const refreshRes = await client.route().post({
    endpoint: '/auth/session',
    options: {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      },
      body: {
        csrfToken,
        data: { accessToken, accessTokenExpireDate },
      },
      isPublic: true,
    },
  });
  const setCookieHeader = refreshRes.headers?.get('set-cookie') || refreshRes.headers?.get('Set-Cookie') || undefined;
  return { setCookieHeader };
}
