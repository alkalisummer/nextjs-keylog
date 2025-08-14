'use server';

import { client } from '@/shared/lib/client';

interface CheckPasswordProps {
  userId: string;
  password: string;
}

export const checkPassword = async ({ userId, password }: CheckPasswordProps) => {
  const response = await client.user().get({ endpoint: `/${userId}/password` });
};
