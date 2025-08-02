import { client } from '@/shared/lib/client';

interface SaveVerifyCodeProps {
  verifyCode: string;
  expireTime: string;
}

export const saveVerifyCode = async ({ verifyCode, expireTime }: SaveVerifyCodeProps) => {
  return await client.user().post({
    endpoint: '/verifyCode',
    options: {
      body: {
        verifyCode,
        expireTime,
      },
    },
  });
};
