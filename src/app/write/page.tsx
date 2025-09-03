'use server';

import { Write } from './ui/Write';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getPost } from '@/entities/post/api';
import { queryKey } from '@/app/provider/query/lib';
import { getCustomSession } from '@/shared/lib/util';
import { getDailyTrends } from '@/entities/trend/api';
import { getPostHashtags } from '@/entities/hashtag/api';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';
import { getArticlesServer } from '@/entities/article/api';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

interface PageProps {
  searchParams: Promise<{ postId?: string }>;
}

export const Page = async ({ searchParams }: PageProps) => {
  const { postId } = await searchParams;
  const queryClient = new QueryClient();
  const session = await getCustomSession();

  // 로그인 체크
  if (!session?.user?.id) {
    redirect(`/login?redirect=${encodeURIComponent('/write')}`);
  }

  //trends init data prefetch
  const dailyTrendsQueryOptions = {
    queryKey: queryKey().trend().trendsList(),
    queryFn: () => getDailyTrends({ geo: 'KR', hl: 'ko' }),
  };

  const dailyTrendsRes = await queryClient.ensureQueryData(dailyTrendsQueryOptions);

  if (!dailyTrendsRes.ok) throw new Error('dailyTrends fetch error');

  const dailyTrends = dailyTrendsRes.data;

  //init trend articles prefetch
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

  let post = null;

  // postId가 있으면 수정 모드
  if (postId) {
    const postQueryOptions = {
      queryKey: queryKey().post().postDetail(Number(postId)),
      queryFn: () => getPost(Number(postId)),
    };

    const postRes = await queryClient.fetchQuery(postQueryOptions);

    if (!postRes.ok) {
      notFound();
    }

    post = postRes.data;

    // 작성자 권한 체크
    if (post.authorId !== session.user.id) {
      throw new Error('Unauthorized');
    }

    const hashtagsQueryOptions = {
      queryKey: queryKey().hashtag().postHashtags(Number(postId)),
      queryFn: () => getPostHashtags(Number(postId)),
    };

    await queryClient.prefetchQuery(hashtagsQueryOptions);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <main>
        <Write trends={dailyTrends} authorId={session.user.id} post={post || undefined} />
      </main>
    </HydrationBoundary>
  );
};

export default Page;
