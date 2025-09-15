import { View } from './ui/View';
import { formatDate } from '@/shared/lib/util';
import { queryKey } from '@/app/provider/query/lib';
import { getDailyTrends } from '@/entities/trend/api';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';
import { getArticlesServer } from '@/entities/article/api';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HydrateClient } from '@/app/provider/query/lib/HydrateClient';

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

  const baseDate = formatDate({ date: new Date(), seperator: '.' });
  await queryClient.prefetchQuery(articlesQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateClient state={dehydratedState}>
      <View trends={trends} baseDate={baseDate} />
    </HydrateClient>
  );
};
