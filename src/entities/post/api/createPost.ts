'use server';

import { client } from '@/shared/lib/client';
import { getCustomSession } from '@/shared/lib/util';
import { CreatePostInput, CreatePostResponse } from '../model';

export const createPost = async (data: CreatePostInput) => {
  const session = await getCustomSession();

  if (!session) {
    throw new Error('Unauthorized');
  }
  data.authorId = session.user.id;
  return await client.post().post<CreatePostResponse>({
    options: {
      body: data,
      isPublic: false,
    },
  });
};
