'use server';

import { client } from '@/shared/lib/client';
import { HashtagInfo } from '../model';

export const getHashtags = async (authorId: string) => {
  const { data } = await client.hashtag().get<HashtagInfo[]>({
    endpoint: `/info/${authorId}`,
  });
  return data;
};
