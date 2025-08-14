import { login } from '@/features/login/api';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { refreshToken } from '@/features/login/api';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour
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

      // 클라이언트 측 update() 호출 시
      if (trigger === 'update') {
        if (session.type === 'uploadImg' && session.imgUrl) token.picture = session.imgUrl;
        if (session.type === 'deleteImg') token.picture = '';
        if (session.nickname) token.name = session.nickname;
        if (session.blogName) token.blogName = session.blogName;
        if (session.email) token.email = session.email;
      }

      if (token.accessTokenExpireDate < new Date()) {
        const refreshRes = await refreshToken();
        if (!refreshRes.ok) {
          throw new Error('Failed to refresh token');
        }
        token.accessToken = refreshRes.data.accessToken;
        token.accessTokenExpireDate = refreshRes.data.accessTokenExpireDate;
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
        session.accessTokenExpireDate = token.accessTokenExpireDate as Date;
      }

      return session;
    },
    async redirect({ url }) {
      return url;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
