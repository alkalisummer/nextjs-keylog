'use server';

import { client } from '@/shared/lib/client';
import { RecentComment } from '../model';

export const getRecentComments = async (authorId: string) => {
  const { data } = await client.comment().get<RecentComment[]>({
    endpoint: `/recent/${authorId}`,
  });
  return data;
};
