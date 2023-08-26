import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { handleMySql } from '../HandlePost';

export default NextAuth({
  session: {
    strategy: 'jwt', // jwt로 세션을 관리(쿠키에 저장됨)
    maxAge: 60 * 60, // 세션 만료시간은 1 hour
  },
  providers: [
    CredentialsProvider({
      // 로그인 방식명
      name: 'EMAIL, PW',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: '이메일', type: 'email', placeholder: '이메일을 입력하세요.' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: '1', name: 'J Smith', email: 'jsmith@example.com' };
        if (credentials?.username == 'test@gmail.com' && credentials?.password == 'hello123') {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    session({ session, token, user }) {
      return session; // The return type will match the one returned in `useSession()`
    },
  },
});
