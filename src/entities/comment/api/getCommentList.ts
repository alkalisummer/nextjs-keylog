'use server';

import { client } from '@/shared/lib/client';
import { Comment } from '../model';

export const getCommentList = async (postId: string) => {
  return await client.comment().get<Comment[]>({
    options: {
      searchParams: {
        postId,
      },
    },
  });
};
