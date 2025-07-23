'use client';

import { Session } from 'next-auth';
import { Dispatch, SetStateAction, useEffect } from 'react';

interface Props {
  setSessionRefetchInterval: Dispatch<SetStateAction<number>>;
  session?: Session;
}

export const useRefreshToken = ({ setSessionRefetchInterval, session }: Props) => {
  useEffect(() => {
    // session이 없으면 early return
    if (!session) return;

    // 토큰 만료시간(초)
    const tokenExp = session?.user?.tokenExp;

    // 만료되기 10분전일 경우 토큰 재발급
    if (session && tokenExp) {
      const currTime = Math.round(Date.now() / 1000);
      const timeRemaining = parseInt(tokenExp) - 10 * 60 - currTime;

      setSessionRefetchInterval(timeRemaining > 0 ? timeRemaining : 0);
    }
  }, [session, setSessionRefetchInterval]);
};
