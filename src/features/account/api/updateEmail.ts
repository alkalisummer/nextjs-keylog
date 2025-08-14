'use server';

import { client } from '@/shared/lib/client';

interface UpdateEmailProps {
  userId: string;
  email: string;
}

export const updateEmail = async ({ userId, email }: UpdateEmailProps) => {
  return await client.user().put({
    endpoint: `/${userId}/email`,
    options: {
      body: { email },
    },
  });
};
