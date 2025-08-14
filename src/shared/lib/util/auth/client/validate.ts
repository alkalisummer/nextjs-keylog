'use client';

import { useSession } from 'next-auth/react';

export const isAuthenticated = () => {
  const { data: session, status } = useSession();
  let isLoggedIn = status !== 'unauthenticated';

  // 토큰 만료 시간 확인
  const tokenExp = session?.user?.tokenExp;
  if (tokenExp && status === 'authenticated') {
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = parseInt(tokenExp);

    // 토큰이 만료된 경우
    if (currentTime >= expirationTime) {
      isLoggedIn = false;
    }
  }

  return isLoggedIn;
};
