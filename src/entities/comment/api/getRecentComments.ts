'use server';

import { client } from '@/shared/lib/client';
import { RecentComment } from '../model';

export const getRecentComments = async (authorId: string) => {
  return await client.comment().get<RecentComment[]>({
    endpoint: `/recent/${authorId}`,
  });
};
