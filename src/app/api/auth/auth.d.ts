import NextAuth, { DefaultSession, User } from 'next-auth';

// user 객체에 id와 블로그 이름 추가
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
      blogName?: string;
      tokenExp?: string;
    } & DefaultSession['user'];
  }
}
