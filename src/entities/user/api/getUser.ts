'use server';

import { client } from '@/shared/lib/client';
import { User } from '../model';

export const getUser = async (userId: string) => {
  return await client.user().get<User>({
    endpoint: `/${userId}`,
    options: {
      isPublic: true,
    },
  });
};
