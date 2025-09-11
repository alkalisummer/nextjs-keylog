import { decodeUrl } from './lib';
import { login } from '@/features/login/api';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour
    updateAge: 60 * 30, // 30 minutes
  },
  providers: [
    CredentialsProvider({
      name: 'ID, PW',
      credentials: {
        id: {
          label: '아이디',
          type: 'text',
          placeholder: '아이디를 입력하세요.',
        },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { id, password } = credentials;

        //로그인
        const loginRes = await login({ id, password });
        if (!loginRes.ok) return null;

        const { user, accessToken, accessTokenExpireDate } = loginRes.data;

        return {
          id: user.userId,
          email: user.userEmail,
          name: user.userNickname,
          image: user.userThmbImgUrl || '',
          blogName: user.userBlogName,
          accessToken,
          accessTokenExpireDate,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 최초 로그인 시
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.picture = user.image;
        token.name = user.name;
        token.blogName = user.blogName;
        token.accessToken = user.accessToken;
        token.accessTokenExpireDate = user.accessTokenExpireDate;
      }

      // 계정정보수정 update() 호출 시
      if (trigger === 'update') {
        if (session.type === 'uploadImg' && session.imgUrl) token.picture = session.imgUrl;
        if (session.type === 'deleteImg') token.picture = '';
        if (session.nickname) token.name = session.nickname;
        if (session.blogName) token.blogName = session.blogName;
        if (session.email) token.email = session.email;
        if (session.accessToken) token.accessToken = session.accessToken;
        if (session.accessTokenExpireDate) token.accessTokenExpireDate = session.accessTokenExpireDate;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        session.user.blogName = token.blogName as string;
        session.user.tokenExp = token.exp as string; // 만료 시각
        session.accessToken = token.accessToken as string;
        session.accessTokenExpireDate = token.accessTokenExpireDate as number;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      try {
        if (url.startsWith('/')) return new URL(url, baseUrl).toString();
        const decodedUrl = decodeUrl(url);
        const target = new URL(decodedUrl);
        if (target.origin === baseUrl) return target.toString();
      } catch {}
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
