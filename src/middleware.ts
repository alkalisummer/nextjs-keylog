import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET;
const baseUrl = process.env.BASE_URL;

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  //로그인이 되어 있을 경우 토큰이 존재
  const token = await getToken({ req, secret });

  //로그인이 되어 있는 경우 로그인, 회원가입 화면 접근 불가
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    if (token) {
      // 쿼리 파라미터로 redirect 경로가 있는 경우 해당 경로로 이동
      const redirectTo = req.nextUrl.searchParams.get('redirect');
      if (redirectTo) {
        return NextResponse.redirect(new URL(redirectTo, req.url));
      }

      // Referer 헤더에서 이전 경로 확인
      const referer = req.headers.get('referer');
      if (referer) {
        const refererUrl = new URL(referer);
        const refererPath = refererUrl.pathname;
        // 이전 경로가 로그인/회원가입 페이지가 아니고, 같은 도메인인 경우
        if (
          !refererPath.startsWith('/login') &&
          !refererPath.startsWith('/signup') &&
          refererUrl.origin === req.nextUrl.origin
        ) {
          return NextResponse.redirect(new URL(refererPath, req.url));
        }
      }

      // 기본값으로 /home으로 리다이렉트
      return NextResponse.redirect(new URL('/home', req.url));
    }
  }

  // 로그인이 필요한 경로들 정의
  const protectedPaths = ['/write'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  //로그인이 되어 있지 않은 경우 보호된 경로 접근 불가
  if (isProtectedPath && !token) {
    // 현재 경로를 쿼리 파라미터로 전달하여 로그인 페이지로 리다이렉트
    const origin = baseUrl || req.nextUrl.origin;
    const loginUrl = new URL('/login', origin);
    loginUrl.searchParams.set('redirect', pathname + search);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/', '/login', '/signup', '/write', '/write/:path*'],
};
