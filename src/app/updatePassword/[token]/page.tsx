'use server';

import { validateToken } from '@/features/login/lib';
import { UpdatePasswordForm } from '@/features/login/component';
import { getPasswordResetToken } from '@/features/login/api';

export const Page = async ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = await params;

  const userToken = await getPasswordResetToken(token);

  if (!userToken.ok) {
    throw new Error('userToken fetch error');
  }

  const isValidToken = validateToken(userToken.data.expireTime);
  const userId = userToken.data.userId;

  return (
    <main>
      <UpdatePasswordForm token={token} userId={userId} isValidToken={isValidToken} />
    </main>
  );
};

export default Page;
