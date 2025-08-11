import NextAuth, { DefaultSession, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export interface UserInfo {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  blogName?: string;
  tokenExp?: string;
}

// user 객체에 id와 블로그 이름 추가
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: UserInfo;
  }

  interface User extends UserInfo {}
}

declare module 'next-auth/jwt' {
  interface JWT extends UserInfo {}
}
