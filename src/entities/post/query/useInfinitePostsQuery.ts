import { Post } from '../model';
import { getPosts } from '../api';
import { queryKey } from '@/app/provider/query/lib';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';
import type { ApiResponse } from '@/shared/lib/client';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';

interface UseInfinitePostsQueryProps {
  searchWord?: string;
  tagId?: string;
  authorId?: string;
  perPage?: number;
  tempYn?: string;
  initialPage?: Post[];
}

export const useInfinitePostsQuery = ({
  searchWord = '',
  tagId,
  authorId,
  perPage = NUMBER_CONSTANTS.BLOG_POST_PER_PAGE,
  tempYn = 'N',
  initialPage,
}: UseInfinitePostsQueryProps) => {
  const initialData: InfiniteData<Post[], number> | undefined = initialPage
    ? { pages: [initialPage], pageParams: [1] }
    : undefined;

  return useInfiniteQuery<Post[], Error, InfiniteData<Post[], number>, (string | number)[], number>({
    queryKey: queryKey().post().postList({ searchWord, tagId, authorId, currPageNum: 1, perPage, tempYn }),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res: ApiResponse<Post[]> = await getPosts({
        searchWord,
        tagId,
        authorId,
        currPageNum: pageParam,
        perPage,
        tempYn,
      });
      if (!res.ok) {
        throw new Error(res.error);
      }
      return res.data;
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const totalItems = lastPage[0]?.totalItems;
      const lastPageItemIndex = Number(lastPage[lastPage.length - 1]?.pageIndx);
      const hasMorePages = totalItems && lastPageItemIndex !== totalItems;
      return hasMorePages ? lastPageParam + 1 : undefined;
    },
    initialData,
  });
};
