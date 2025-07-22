'use server';

import { PostDetail } from '../model';
import { client } from '@/shared/lib/client';

export const getPost = async (postId: number) => {
  return await client.post().get<PostDetail>({
    endpoint: `/${postId}`,
    options: {
      searchParams: {
        postId,
      },
    },
  });
};
