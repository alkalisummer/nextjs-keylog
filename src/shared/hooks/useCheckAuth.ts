'use client';

import { useSession } from 'next-auth/react';

export const useCheckAuth = (userId: string) => {
  //사용자 세션
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;

  let isAuthorized = false;

  if (status === 'authenticated' && currentUserId === userId) {
    isAuthorized = true;
  } else {
    isAuthorized = false;
  }

  return isAuthorized;
};
