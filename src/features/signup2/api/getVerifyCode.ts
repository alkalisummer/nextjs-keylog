'use server';

import { VerifyCodeInfo } from '../model';
import { client } from '@/shared/lib/client';

export const getVerifyCode = async (code: string) => {
  return await client.user().get<VerifyCodeInfo>({
    endpoint: `/verifyCode/${code}`,
    options: {
      isPublic: true,
    },
  });
};
