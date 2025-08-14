import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    accessTokenExpireDate: Date;
    user: DefaultSession['user'] & {
      id: string;
      blogName?: string;
      tokenExp?: string;
    };
  }

  interface User {
    accessToken: string;
    accessTokenExpireDate: Date;
    blogName?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    blogName?: string;
    accessToken: string;
    accessTokenExpireDate: Date;
  }
}
