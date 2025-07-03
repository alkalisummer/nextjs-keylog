'use server';

import { View } from './ui/View';
import { queryKey } from '../provider/query/lib';
import { getPosts } from '@/entities/posts/api';
import { getArticles } from '@/entities/articles/api';
import { getDailyTrends } from '@/entities/trends/api';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';
import { TrendsContainer } from '@/entities/trends/container/TrendsContainer';
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
      getArticles({ articleKeys: initTrendKeywordInfo.articleKeys, articleCount: NUMBER_CONSTANTS.ARTICLE_COUNT }),
  };
  await queryClient.prefetchQuery(articlesQueryOptions);
  const articles = await queryClient.ensureQueryData(articlesQueryOptions);

  //posts init data
  const postsQueryOptions = {
    queryKey: queryKey().post().postList({ searchWord: '', currPageNum: 1 }),
    queryFn: () => getPosts({ searchWord: '', currPageNum: 1 }),
  };
  await queryClient.prefetchQuery(postsQueryOptions);
  const posts = await queryClient.ensureQueryData(postsQueryOptions);

  if (!posts.data) throw new Error('posts fetch error');

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <TrendsContainer>
        <View trends={dailyTrends} initialArticles={articles} initialPosts={posts.data} />
      </TrendsContainer>
    </HydrationBoundary>
  );
};

export default Page;
