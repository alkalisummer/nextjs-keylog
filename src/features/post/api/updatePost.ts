'use server';

import { client } from '@/shared/lib/client';
import { getCustomSession } from '@/shared/lib/util';
import { UpdatePostInput, PostResponse } from '../../../entities/post/model';

export const updatePost = async (postId: number, data: UpdatePostInput) => {
  const session = await getCustomSession();

  if (!session) {
    throw new Error('Unauthorized');
  }
  data.authorId = session.user.id;

  return await client.post().put<PostResponse>({
    endpoint: `/${postId}`,
    options: {
      body: data,
      isPublic: false,
    },
  });
};
