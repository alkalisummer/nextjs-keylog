'use server';

import { client } from '@/shared/lib/client';
import { AuthUser } from '../model/type';

export const refreshToken = async () => {
  return await client.user().post<AuthUser>({
    endpoint: '/refresh',
    options: {
      isPublic: true,
    },
  });
};
