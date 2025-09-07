import { Post } from '../model';
import { client } from '@/shared/lib/client';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';

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
  perPage = NUMBER_CONSTANTS.BLOG_POST_PER_PAGE,
  currPageNum = 1,
  searchWord = '',
  tempYn = 'N',
  tagId,
}: GetPostsProps) => {
  return await client.post().get<Post[]>({
    options: {
      searchParams: {
        authorId,
        perPage,
        currPageNum,
        searchWord,
        tempYn,
        tagId,
      },
      isPublic: true,
    },
  });
};
