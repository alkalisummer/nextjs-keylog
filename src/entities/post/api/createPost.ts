'use server';

import { client } from '@/shared/lib/client';
import { CreatePostInput, CreatePostResponse } from '../model';

export const createPost = async (data: CreatePostInput) => {
  return await client.post().post<CreatePostResponse>({
    endpoint: '/',
    options: {
      body: data,
      isPublic: false,
    },
  });
};
