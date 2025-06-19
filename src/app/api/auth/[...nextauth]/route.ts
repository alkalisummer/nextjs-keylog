// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { handleMySql } from '@/app/api/HandleUser';
import { verifyPassword } from '@/utils/Bcypt';

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

        // DB 조회
        const params = { type: 'getUser', id };
        const user = (await handleMySql(params)).items[0];

        // 비밀번호 검증
        const valid = await verifyPassword(password, user?.USER_PASSWORD);
        if (!user || !valid) return null;

        return {
          id: user.USER_ID,
          email: user.USER_EMAIL,
          name: user.USER_NICKNAME,
          image: user.USER_THMB_IMG_URL ?? '',
          blogName: user.USER_BLOG_NAME,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      // 최초 로그인 시
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.picture = user.image;
        token.name = user.name;
        token.blogName = user.blogName;
      }

      // 클라이언트 측 update() 호출 시
      if (trigger === 'update') {
        if (session.type === 'uploadImg' && session.imgUrl) token.picture = session.imgUrl;
        if (session.type === 'deleteImg') token.picture = '';
        if (session.nickname) token.name = session.nickname;
        if (session.blogName) token.blogName = session.blogName;
        if (session.email) token.email = session.email;
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
