'use server';

import { client } from '@/shared/lib/client';

interface ResetPasswordProps {
  userId: string;
  newPassword: string;
  token: string;
}

export const resetPassword = async ({ userId, newPassword, token }: ResetPasswordProps) => {
  return await client.user().put({
    endpoint: `/reset/${userId}/password`,
    options: {
      isPublic: true,
      body: {
        password: newPassword,
        token,
      },
    },
  });
};
