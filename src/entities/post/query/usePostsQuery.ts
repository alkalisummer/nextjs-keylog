import { Post } from '../model';
import { getPosts } from '../api';
import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/app/provider/query/lib';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';

interface UsePostsQueryProps {
  searchWord?: string;
  tagId?: string;
  authorId?: string;
  currPageNum?: number;
  perPage?: number;
  tempYn?: string;
}

export const usePostsQuery = ({
  searchWord = '',
  tagId,
  authorId,
  currPageNum = 1,
  perPage = NUMBER_CONSTANTS.POST_PER_PAGE,
  tempYn = 'N',
}: UsePostsQueryProps) => {
  const { data } = useQuery({
    queryKey: queryKey().post().postList({ searchWord, tagId, authorId, currPageNum, perPage, tempYn }),
    queryFn: () => getPosts({ searchWord, tagId, authorId, currPageNum, perPage, tempYn }),
  });
  return data;
};
