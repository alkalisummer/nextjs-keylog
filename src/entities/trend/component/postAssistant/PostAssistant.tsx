import { View } from './ui/View';
import { queryKey } from '@/app/provider/query/lib';
import { getDailyTrends } from '@/entities/trend/api';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';
import { getArticlesServer } from '@/entities/article/api';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const PostAssistant = async () => {
  const queryClient = new QueryClient();

  const trendsQueryOptions = {
    queryKey: queryKey().trend().trendsList(),
    queryFn: () => getDailyTrends({ geo: 'KR', hl: 'ko' }),
  };

  const trendsRes = await queryClient.ensureQueryData(trendsQueryOptions);

  if (!trendsRes.ok) throw new Error('trends fetch error');

  const trends = trendsRes.data;

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
      <View trends={trends} />;
    </HydrationBoundary>
  );
};
