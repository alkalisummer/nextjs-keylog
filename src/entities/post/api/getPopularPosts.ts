'use server';

import { PopularPost } from '../model';
import { client } from '@/shared/lib/client';

export const getPopularPosts = async (authorId: string) => {
  const { data } = await client.post().get<PopularPost[]>({
    endpoint: `/popular/${authorId}`,
  });
  return data;
};
