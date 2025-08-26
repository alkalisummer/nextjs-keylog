'use server';

import { client } from '@/shared/lib/client';
import { UpdatePostInput, UpdatePostResponse } from '../model';

export const updatePost = async (postId: number, data: UpdatePostInput) => {
  return await client.post().put<UpdatePostResponse>({
    endpoint: `/${postId}`,
    options: {
      body: data,
      isPublic: false,
    },
  });
};
