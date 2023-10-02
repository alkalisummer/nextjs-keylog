import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { handleMySql } from '../HandleUser';
import { verifyPassword } from '@/utils/Bcypt';

export default NextAuth({
  session: {
    strategy: 'jwt', // jwt로 세션을 관리(쿠키에 저장됨)
    maxAge: 60 * 60, // 세션 만료시간은 1 hour
  },
  providers: [
    CredentialsProvider({
      // 로그인 방식명
      name: 'EMAIL, PW',
      credentials: {
        id: { label: '아이디', type: 'text', placeholder: '아이디를 입력하세요.' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials, req) {
        const id = credentials?.id;
        const password = credentials?.password;

        const params = { type: 'getUser', id: id };
        const user = await handleMySql(params).then((res) => {
          return res.items[0];
        });
        const isValid = await verifyPassword(password!, user.USER_PASSWORD);
        if (user && isValid) {
          return { id: user.USER_ID, email: user.USER_EMAIL, name: user.USER_NICKNAME, image: user.USER_THMB_IMG_URL ? user.USER_THMB_IMG_URL : '', blogName: user.USER_BLOG_NAME };
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.picture = user.image;
        token.name = user.name;
        token.blogName = user.blogName;
      }
      if (trigger === 'update') {
        if (session.type === 'uploadImg' && session.imgUrl) {
          token.picture = session.imgUrl;
        }
        if (session.type === 'deleteImg') {
          token.picture = '';
        }
        if (session.nickname) {
          token.name = session.nickname;
        }
        if (session.blogName) {
          token.blogName = session.blogName;
        }
        if (session.email) {
          token.email = session.email;
        }
      }
      return token;
    },
    async session({ session, token, user }: { session: any; token: any; user: any }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;
      session.user.blogName = token.blogName;
      session.user.tokenExp = token.exp;

      return session; // The return type will match the one returned in `useSession()`
    },
    async redirect({ url }) {
      return url;
    },
  },
});
