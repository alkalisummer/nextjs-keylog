'use client';

import { useRouter } from 'next/navigation';

interface UseHashtagRouterProps {
  userId: string;
  setHashtagId: (hashtagId: number | null) => void;
}

export const useHashtagRouter = ({ userId, setHashtagId }: UseHashtagRouterProps) => {
  const router = useRouter();

  return {
    route: (hashtagId: number | null) => {
      setHashtagId(hashtagId);
      if (hashtagId === null) {
        router.push(`/${userId}`);
      } else {
        router.push(`/${userId}?tagId=${hashtagId}`);
      }
    },
  };
};
