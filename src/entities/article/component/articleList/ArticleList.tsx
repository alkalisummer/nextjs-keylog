'use server';

import { View } from './ui/View';
import { formatDate } from '@/shared/lib/util';
import { Trend } from '@/entities/trend/model';
import { queryKey } from '@/app/provider/query/lib';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';
import { getArticlesServer } from '@/entities/article/api';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HydrateClient } from '@/app/provider/query/lib/HydrateClient';

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
  const baseDate = formatDate({ date: new Date(), seperator: '.' });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateClient state={dehydratedState}>
      <View baseDate={baseDate} />
    </HydrateClient>
  );
};
