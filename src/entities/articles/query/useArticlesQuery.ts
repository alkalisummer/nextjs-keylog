import { Article } from '../model';
import { getArticles } from '../api';
import { Trend } from '@/entities/trends/model';
import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/app/provider/query/lib';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';

interface UseArticlesQueryProps {
  trends: Trend[];
  selectedTrend: Trend;
  initialData: Article[];
}

export const useArticlesQuery = ({ trends, selectedTrend, initialData }: UseArticlesQueryProps) => {
  return useQuery({
    queryKey: queryKey().article().articleList(selectedTrend.keyword),
    queryFn: () =>
      getArticles({
        articleKeys: selectedTrend.articleKeys,
        articleCount: NUMBER_CONSTANTS.ARTICLE_COUNT,
      }),
    initialData: selectedTrend.keyword === trends[0].keyword ? initialData : undefined,
  });
};
