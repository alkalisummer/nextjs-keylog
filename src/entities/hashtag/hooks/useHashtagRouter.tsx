'use client';

import { useRouter } from 'next/navigation';

interface UseHashtagRouterProps {
  userId: string;
  setSelectedHashtag: (hashtagId: number | null) => void;
}

export const useHashtagRouter = ({ userId, setSelectedHashtag }: UseHashtagRouterProps) => {
  const router = useRouter();

  return {
    route: (hashtagId: number | null) => {
      setSelectedHashtag(hashtagId);
      if (hashtagId === null) {
        router.push(`/${userId}`);
      } else {
        router.push(`/${userId}?tagId=${hashtagId}`);
      }
    },
  };
};
