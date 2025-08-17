import { NextResponse } from 'next/server';
import {
  applySetCookieHeader,
  fetchNextAuthCsrfToken,
  getCurrentCookieHeader,
  refreshAccessToken,
  updateNextAuthSession,
} from '@/shared/lib/util/auth/server/token';

export const POST = async () => {
  try {
    const cookieHeader = await getCurrentCookieHeader();

    const { result, setCookieHeader: apiSetCookie } = await refreshAccessToken();
    await applySetCookieHeader(apiSetCookie);

    const csrfToken = await fetchNextAuthCsrfToken(cookieHeader);
    const { setCookieHeader: nextAuthSetCookie } = await updateNextAuthSession({
      accessToken: result.accessToken,
      accessTokenExpireDate: result.accessTokenExpireDate,
      cookieHeader,
      csrfToken,
    });
    await applySetCookieHeader(nextAuthSetCookie);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
  }
};
