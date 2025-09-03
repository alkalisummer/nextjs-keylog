'use server';

import { View } from './ui/View';
import { Trend } from '@/entities/trend/model';
import { queryKey } from '@/app/provider/query/lib';
import { getArticlesServer } from '@/entities/article/api';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface ArticleListProps {
  trends: Trend[];
}

export const ArticleList = async ({ trends }: ArticleListProps) => {
  const queryClient = new QueryClient();

  //init trend keyword articles prefetch
  const initTrendKeywordInfo = trends[0];
  const articlesQueryOptions = {
    queryKey: queryKey().article().articleList(initTrendKeywordInfo.keyword),
    queryFn: () =>
      getArticlesServer({
        articleKeys: initTrendKeywordInfo.articleKeys,
        articleCount: NUMBER_CONSTANTS.ARTICLE_COUNT,
      }),
  };
  await queryClient.prefetchQuery(articlesQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <View />
    </HydrationBoundary>
  );
};
