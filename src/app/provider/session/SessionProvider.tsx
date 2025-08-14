'use client';

import { Session } from 'next-auth';
import { ReactNode } from 'react';
import { SESSION_REFETCH_INTERVAL } from '@/shared/lib/constants';
import { SessionProvider as AuthSessionProvider } from 'next-auth/react';

export function SessionProvider({ children, session }: { children: ReactNode; session: Session | null }) {
  return (
    <AuthSessionProvider refetchInterval={SESSION_REFETCH_INTERVAL} session={session}>
      {children}
    </AuthSessionProvider>
  );
}
