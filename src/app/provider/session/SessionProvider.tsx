'use client';

import { Session } from 'next-auth';
import { RefreshToken } from './component';
import { ReactNode, useState } from 'react';
import { SessionProvider as AuthSessionProvider } from 'next-auth/react';

export function SessionProvider({ children, session }: { children: ReactNode; session: Session | null }) {
  const [sessionRefetchInterval, setSessionRefetchInterval] = useState(10000);

  return (
    <AuthSessionProvider refetchInterval={sessionRefetchInterval} session={session}>
      <RefreshToken setSessionRefetchInterval={setSessionRefetchInterval} />
      {children}
    </AuthSessionProvider>
  );
}
