import type { NextRequest, NextFetchEvent } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.SECRET;

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  //로그인이 되어 있을 경우 토큰이 존재
  const token = await getToken({ req, secret, raw: true });

  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    if (token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
}

export const config = {
  matcher: ['/login', '/signup'],
};
