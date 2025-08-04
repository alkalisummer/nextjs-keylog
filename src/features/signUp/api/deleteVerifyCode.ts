'use server';

import { client } from '@/shared/lib/client';

export const deleteVerifyCode = async (code: string) => {
  return await client.user().delete({
    endpoint: `/verifyCode/${code}`,
  });
};
