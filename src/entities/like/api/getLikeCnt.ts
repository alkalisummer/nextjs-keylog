import { LikeRes } from '../model';
import { client } from '@/shared/lib/client';

export const getLikeCnt = async (postId: string) => {
  return await client.like().get<LikeRes>({
    endpoint: `/count`,
    options: {
      searchParams: {
        postId,
      },
    },
  });
};
