'use server';

import { client } from '@/shared/lib/client';
import { LikeRes } from '@/entities/like/model';

interface LikePostProps {
  postId: string;
  userId: string;
}

export const likePost = async ({ postId, userId }: LikePostProps) => {
  return await client.like().post<LikeRes>({
    options: {
      searchParams: {
        postId,
        userId,
      },
    },
  });
};
