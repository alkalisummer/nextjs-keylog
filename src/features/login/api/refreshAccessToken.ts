import { client } from '@/shared/lib/client';
import { AuthUser } from '../model/type';

export const refreshAccessToken = async () => {
  return await client.user().post<AuthUser>({
    endpoint: '/refresh',
    options: {
      isPublic: true,
      withCookie: true,
    },
  });
};
