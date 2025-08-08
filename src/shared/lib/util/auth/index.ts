'use client';

import { useSession } from 'next-auth/react';

export const isAuthenticated = () => {
  const { data: session, status } = useSession();

  // 세션이 로딩 중이거나 인증되지 않은 경우
  if (status !== 'authenticated' || !session?.user) {
    return false;
  }

  // 토큰 만료 시간 확인
  const tokenExp = session.user.tokenExp;
  if (tokenExp) {
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = parseInt(tokenExp);

    // 토큰이 만료된 경우
    if (currentTime >= expirationTime) {
      return false;
    }
  }

  return true;
};
