'use server';

import { UserToken } from '../model/type';
import { client } from '@/shared/lib/client';

export const getPasswordResetToken = async (token: string) => {
  return await client.user().get<UserToken>({
    endpoint: `/tokens/${token}`,
  });
};
