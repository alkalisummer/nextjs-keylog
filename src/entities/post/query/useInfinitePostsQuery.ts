import { Post } from '../model';
import { getPosts } from '../api';
import { queryKey } from '@/app/provider/query/lib';
import type { ApiResponse } from '@/shared/lib/client';
import { useInfiniteQuery, InfiniteData, QueryKey } from '@tanstack/react-query';

interface UseInfinitePostsQueryProps {
  searchWord?: string;
  tagId?: string;
  initialPage?: Post[];
}

export const useInfinitePostsQuery = ({ searchWord = '', tagId, initialPage }: UseInfinitePostsQueryProps) => {
  const initialData: InfiniteData<Post[], number> | undefined = initialPage
    ? { pages: [initialPage], pageParams: [1] }
    : undefined;

  return useInfiniteQuery<Post[], Error, InfiniteData<Post[], number>, QueryKey, number>({
    queryKey: queryKey().post().postSearch({ searchWord, tagId }),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res: ApiResponse<Post[]> = await getPosts({
        searchWord,
        tagId,
        currPageNum: pageParam,
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
