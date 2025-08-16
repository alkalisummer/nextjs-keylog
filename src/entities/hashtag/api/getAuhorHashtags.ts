'use server';

import { client } from '@/shared/lib/client';
import { HashtagInfo } from '../model';

export const getAuthorHashtags = async (authorId: string) => {
  return await client.hashtag().get<HashtagInfo[]>({
    endpoint: `/info/${authorId}`,
    options: {
      isPublic: true,
    },
  });
};
