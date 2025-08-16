'use server';

import { client } from '@/shared/lib/client';

interface UpdateEmailProps {
  email: string;
}

export const updateEmail = async ({ email }: UpdateEmailProps) => {
  return await client.user().put({
    endpoint: `/update/email`,
    options: {
      body: { email },
    },
  });
};
