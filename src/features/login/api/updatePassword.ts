'use server';

import { client } from '@/shared/lib/client';

interface UpdatePasswordProps {
  userId: string;
  newPassword: string;
}

export const updatePassword = async ({ userId, newPassword }: UpdatePasswordProps) => {
  return await client.user().put({
    endpoint: `/${userId}/password`,
    options: {
      body: {
        userId,
        password: newPassword,
      },
    },
  });
};
