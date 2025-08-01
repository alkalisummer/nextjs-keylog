import { getUser } from '@/entities/user/api';
import { getVerifyCode } from '../api/getVerifyCode';
import { formatDate } from '@/shared/lib/util';

export const isDuplicateUserId = async (userId: string) => {
  const userRes = await getUser(userId);

  if (!userRes.ok) {
    throw new Error('Fetch Get User Error');
  }

  const userData = userRes.data;

  if (userData?.userId) {
    return true;
  }

  return false;
};

export const isVerifyCode = async (code: string) => {
  const verifyCodeRes = await getVerifyCode(code);

  if (!verifyCodeRes.ok) {
    throw new Error('Fetch Get Verify Code Error');
  }
  const currTime = formatDate({ date: new Date(), seperator: '', isFullTime: true });

  const { verifyCode, expirationTime } = verifyCodeRes.data;

  const isValid = verifyCode && currTime <= expirationTime;

  return isValid;
};
