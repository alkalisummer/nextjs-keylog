'use server';

import { AuthUser } from '../model/type';
import { client } from '@/shared/lib/client';
import { setCookies } from '@/shared/lib/util';

interface LoginProps {
  id: string;
  password: string;
}

export const login = async ({ id, password }: LoginProps) => {
  const res = await client.user().post<AuthUser>({
    endpoint: '/login',
    options: {
      body: {
        userId: id,
        userPassword: password,
      },
      isPublic: true,
    },
  });

  if (res.headers) {
    const setCookieHeader = res.headers.get('set-cookie') || res.headers.get('Set-Cookie');
    if (setCookieHeader) {
      await setCookies(setCookieHeader);
    }
  }

  return res;
};
