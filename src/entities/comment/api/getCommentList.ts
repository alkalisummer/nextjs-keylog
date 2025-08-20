'use server';

import { client } from '@/shared/lib/client';
import { CommentRes } from '../model';

export const getCommentList = async (postId: number) => {
  return await client.comment().get<CommentRes>({
    options: {
      searchParams: {
        postId,
      },
      isPublic: true,
    },
  });
};
