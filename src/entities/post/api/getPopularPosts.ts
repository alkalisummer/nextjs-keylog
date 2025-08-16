'use server';

import { PopularPost } from '../model';
import { client } from '@/shared/lib/client';

export const getPopularPosts = async (authorId: string) => {
  return await client.post().get<PopularPost[]>({
    endpoint: `/popular/${authorId}`,
    options: {
      isPublic: true,
    },
  });
};
