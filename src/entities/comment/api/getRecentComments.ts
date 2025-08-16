'use server';

import { client } from '@/shared/lib/client';
import { Comment } from '../model';

export const getRecentComments = async (authorId: string) => {
  return await client.comment().get<Partial<Comment>[]>({
    endpoint: `/recent/${authorId}`,
    options: {
      isPublic: true,
    },
  });
};
