'use server';

import { client } from '@/shared/lib/client';
import { AuthUser } from '../model/type';

interface LoginProps {
  id: string;
  password: string;
}

export const login = async ({ id, password }: LoginProps) => {
  return await client.user().post<AuthUser>({
    endpoint: '/login',
    options: {
      body: {
        userId: id,
        userPassword: password,
      },
      isPublic: true,
    },
  });
};
