'use server';

import { client } from '@/shared/lib/client';
import { LikeRes } from '@/entities/like/model';

interface UnlikePostProps {
  postId: number;
  userId: string;
}

export const unlikePost = async ({ postId, userId }: UnlikePostProps) => {
  return await client.like().delete<LikeRes>({
    options: {
      searchParams: {
        postId,
        userId,
      },
    },
  });
};
