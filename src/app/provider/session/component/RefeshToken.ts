'use client';

import { Dispatch, SetStateAction, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRefreshToken } from '../hook';

interface Props {
  setSessionRefetchInterval: Dispatch<SetStateAction<number>>;
}

export const RefreshToken = ({ setSessionRefetchInterval }: Props) => {
  const { data: session } = useSession();

  if (session) {
    useRefreshToken({ setSessionRefetchInterval, session });
  }

  return null;
};
