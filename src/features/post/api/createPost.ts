'use server';

import { client } from '@/shared/lib/client';
import { getCustomSession } from '@/shared/lib/util';
import { CreatePostInput, PostResponse } from '../../../entities/post/model';

export const createPost = async (data: CreatePostInput) => {
  const session = await getCustomSession();

  if (!session) {
    throw new Error('Unauthorized');
  }
  data.authorId = session.user.id;

  return await client.post().post<PostResponse>({
    options: {
      body: data,
      isPublic: false,
    },
  });
};
