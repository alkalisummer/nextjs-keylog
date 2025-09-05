'use server';

import { validateToken } from '@/features/login/lib';
import { getPasswordResetToken } from '@/features/login/api';
import { ResetPasswordForm } from '@/features/login/component';

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
      <ResetPasswordForm userId={userId} isValidToken={isValidToken} token={userToken.data.token} />
    </main>
  );
};

export default Page;
