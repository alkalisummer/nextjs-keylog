'use server';

import { RecentPost } from '../model';
import { client } from '@/shared/lib/client';

export const getRecentPosts = async (authorId: string) => {
  const { data } = await client.post().get<RecentPost[]>({
    endpoint: `/recent/${authorId}`,
  });
  return data;
};
