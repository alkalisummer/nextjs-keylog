'use client';

import { ReactNode, useState } from 'react';
import { SessionProvider as AuthSessionProvider } from 'next-auth/react';
import { RefreshToken } from './component';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionRefetchInterval, setSessionRefetchInterval] = useState(10000);

  return (
    <AuthSessionProvider refetchInterval={sessionRefetchInterval}>
      <RefreshToken setSessionRefetchInterval={setSessionRefetchInterval} />
      {children}
    </AuthSessionProvider>
  );
}
