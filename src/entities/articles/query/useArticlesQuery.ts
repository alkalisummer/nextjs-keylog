'use client';

import { Article } from '../model';
import { getArticlesClient } from '../api';
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
      getArticlesClient({
        articleKeys: selectedTrend.articleKeys,
        articleCount: NUMBER_CONSTANTS.ARTICLE_COUNT,
      }).then(articles => articles?.sort((a, b) => b.pressDate[0] - a.pressDate[0])),
    initialData: selectedTrend.keyword === trends[0].keyword ? initialData : undefined,
    refetchOnMount: true,
  });
};
