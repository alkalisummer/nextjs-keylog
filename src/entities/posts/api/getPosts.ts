'use server';

import { client } from '@/shared/lib/client';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';
import { Post } from '../model';

interface GetPostsProps {
  authorId?: string;
  perPage?: number;
  currPageNum?: number;
  searchWord?: string;
  tempYn?: string;
  tagId?: string;
}

export const getPosts = async ({
  authorId,
  perPage = NUMBER_CONSTANTS.POST_PER_PAGE,
  currPageNum = 1,
  searchWord = '',
  tempYn = 'N',
  tagId,
}: GetPostsProps) => {
  return await client.get<Post[]>('/posts', {
    searchParams: {
      authorId,
      perPage,
      currPageNum,
      searchWord,
      tempYn,
      tagId,
    },
  });
};
