import { client } from '@/shared/lib/client';

interface SaveUserTokenProps {
  token: string;
  userId: string;
  expireTime: string;
}

export const savePasswordResetToken = async ({ token, userId, expireTime }: SaveUserTokenProps) => {
  return await client.user().post({
    endpoint: '/tokens',
    options: {
      body: {
        token,
        userId,
        expireTime,
      },
    },
  });
};
