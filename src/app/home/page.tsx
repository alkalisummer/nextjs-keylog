'use server';

import { View } from './ui/View';
import { queryKey } from '../provider/query/lib';
import { getPosts } from '@/entities/post/api';
import { getDailyTrends } from '@/entities/trend/api';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';
import { getArticlesServer } from '@/entities/article/api';
import { HomeContainer } from './container';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export const Page = async () => {
  const queryClient = new QueryClient();

  //trends init data
  const dailyTrendsQueryOptions = {
    queryKey: queryKey().trend().trendsList(),
    queryFn: () => getDailyTrends({ geo: 'KR', hl: 'ko' }),
  };
  await queryClient.prefetchQuery(dailyTrendsQueryOptions);
  const dailyTrends = await queryClient.ensureQueryData(dailyTrendsQueryOptions);

  //articles init data
  const initTrendKeywordInfo = dailyTrends[0];
  const articlesQueryOptions = {
    queryKey: queryKey().article().articleList(initTrendKeywordInfo.keyword),
    queryFn: () =>
      getArticlesServer({
        articleKeys: initTrendKeywordInfo.articleKeys,
        articleCount: NUMBER_CONSTANTS.ARTICLE_COUNT,
      }),
  };
  await queryClient.prefetchQuery(articlesQueryOptions);
  const articles = await queryClient.ensureQueryData(articlesQueryOptions);
  const sortedArticles = articles?.sort((a, b) => b.pressDate[0] - a.pressDate[0]);

  //posts init data
  const postsQueryOptions = {
    queryKey: queryKey().post().postList({ searchWord: '', currPageNum: 1 }),
    queryFn: () => getPosts({ searchWord: '', currPageNum: 1 }),
  };
  await queryClient.prefetchQuery(postsQueryOptions);
  const posts = await queryClient.ensureQueryData(postsQueryOptions);

  if (!posts.ok) throw new Error('posts fetch error');

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeContainer initialTrend={initTrendKeywordInfo}>
        <View trends={dailyTrends} initialArticles={sortedArticles} initialPosts={posts.data} />
      </HomeContainer>
    </HydrationBoundary>
  );
};

export default Page;
