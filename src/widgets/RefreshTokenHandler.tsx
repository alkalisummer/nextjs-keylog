import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect } from 'react';

interface Props {
  setSessionRefetchInterval: Dispatch<SetStateAction<number>>;
}

const RefreshTokenHandler = ({ setSessionRefetchInterval }: Props) => {
  const { data: session } = useSession();

  useEffect(() => {
    // 토큰 만료시간(초)
    const tokenExp = session?.user?.tokenExp;

    // 만료되기 10분전일 경우 토큰 재발급
    if (session && tokenExp) {
      const currTime = Math.round(Date.now() / 1000);
      const timeRemaining = parseInt(tokenExp) - 10 * 60 - currTime;

      setSessionRefetchInterval(timeRemaining > 0 ? timeRemaining : 0);
    }
  }, [session, setSessionRefetchInterval]);

  return null;
};

export default RefreshTokenHandler;
