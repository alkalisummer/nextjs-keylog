import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { handleMySql } from '../HandlePost';
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
        email: { label: '이메일', type: 'email', placeholder: '이메일을 입력하세요.' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;

        const params = { type: 'getUser', email: email };
        const user = await handleMySql(params).then((res) => {
          return res.items[0];
        });
        const isValid = await verifyPassword(password!, user.USER_PASSWORD);
        console.log(isValid);
        if (user && isValid) {
          console.log('탔다');
          return { id: user.USER_ID, email: user.USER_EMAIL, name: user.USER_NICKNAME, image: user.USER_THUMB_IMG_URL ? user.USER_THUMB_IMG_URL : '' };
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    session({ session, token, user }) {
      return session; // The return type will match the one returned in `useSession()`
    },
  },
});
