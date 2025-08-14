import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    accessTokenExpireDate: number;
    user: DefaultSession['user'] & {
      id: string;
      blogName?: string;
      tokenExp?: string;
    };
  }

  interface User {
    accessToken: string;
    accessTokenExpireDate: number;
    blogName?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    blogName?: string;
    accessToken: string;
    accessTokenExpireDate: number;
  }
}
