'use server';

import { client } from '@/shared/lib/client';
import { getCustomSession } from '@/shared/lib/util';
import { UpdatePostInput, UpdatePostResponse } from '../model';

export const updatePost = async (postId: number, data: UpdatePostInput) => {
  const session = await getCustomSession();

  if (!session) {
    throw new Error('Unauthorized');
  }
  data.authorId = session.user.id;

  return await client.post().put<UpdatePostResponse>({
    endpoint: `/${postId}`,
    options: {
      body: data,
      isPublic: false,
    },
  });
};
