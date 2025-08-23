'use server';

import { client } from '@/shared/lib/client';

export const deletePost = async (postId: number) => {
  return await client.post().delete<{ message: string }>({
    endpoint: `/${postId}`,
  });
};
