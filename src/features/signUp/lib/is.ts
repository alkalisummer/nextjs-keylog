import { getUser } from '@/entities/user/api';

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
