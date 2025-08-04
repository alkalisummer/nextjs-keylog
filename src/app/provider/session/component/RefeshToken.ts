'use client';

import { useRefreshToken } from '../hooks';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  setSessionRefetchInterval: Dispatch<SetStateAction<number>>;
}

export const RefreshToken = ({ setSessionRefetchInterval }: Props) => {
  const { data: session } = useSession();

  // 항상 훅을 호출하고, 내부에서 session 체크 처리
  useRefreshToken({ setSessionRefetchInterval, session: session || undefined });

  return null;
};
