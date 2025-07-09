'use server';

import { client } from '@/shared/lib/client';
import { User } from '../model';

export const getUser = async (userId: string) => {
  const { data } = await client.user().get<User>({
    endpoint: `/${userId}`,
  });
  return data;
};
