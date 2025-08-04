'use client';

import { useSession } from 'next-auth/react';

export const isAuthenticated = () => {
  const { status: sessionStatus } = useSession();

  return sessionStatus === 'authenticated';
};
