'use server';

import { View } from './ui/View';
import { queryKey } from '../provider/query/lib';
import { getArticles } from '@/entities/articles/api';
import { getDailyTrends } from '@/entities/trends/api';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';
import { TrendsContainer } from '@/entities/trends/container/TrendsContainer';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export const Page = async () => {
  const queryClient = new QueryClient();

  const dailyTrendsQueryOptions = {
    queryKey: queryKey().trend().trendsList(),
    queryFn: () => getDailyTrends({ geo: 'KR', hl: 'ko' }),
  };

  await queryClient.prefetchQuery(dailyTrendsQueryOptions);
  const dailyTrends = await queryClient.ensureQueryData(dailyTrendsQueryOptions);

  const firstTrendKeywordInfo = dailyTrends[0];
  const firstTrendKeywordArticles = await getArticles({
    articleKeys: firstTrendKeywordInfo.articleKeys,
    articleCount: NUMBER_CONSTANTS.ARTICLE_COUNT,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <TrendsContainer>
        <View trends={dailyTrends} initialArticles={firstTrendKeywordArticles} />
      </TrendsContainer>
    </HydrationBoundary>
  );
};

export default Page;
