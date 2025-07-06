'use client';

import { Article } from '../model';
import { getArticles } from '../api';
import { Trend } from '@/entities/trends/model';
import { queryKey } from '@/app/provider/query/lib';
import { useSuspenseQuery } from '@tanstack/react-query';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';

interface UseArticlesQueryProps {
  trends: Trend[];
  selectedTrend: Trend;
  initialData: Article[];
}

export const useArticlesQuery = ({ trends, selectedTrend, initialData }: UseArticlesQueryProps) => {
  return useSuspenseQuery({
    queryKey: queryKey().article().articleList(selectedTrend.keyword),
    queryFn: () =>
      getArticles({
        articleKeys: selectedTrend.articleKeys,
        articleCount: NUMBER_CONSTANTS.ARTICLE_COUNT,
      }),
    initialData: selectedTrend.keyword === trends[0].keyword ? initialData : undefined,
  });
};
