'use server';

import { Write } from './ui/Write';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getPost } from '@/entities/post/api';
import { getDailyTrends } from '@/entities/trend/api';
import { getPostHashtags } from '@/entities/hashtag/api';
import { getCustomSession } from '@/shared/lib/util';
import { queryKey } from '@/app/provider/query/lib';
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

  // 트렌드 키워드 조회
  const trends = await getDailyTrends({ geo: 'KR', hl: 'ko' });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <main>
        <Write trends={trends} authorId={session.user.id} post={post || undefined} />
      </main>
    </HydrationBoundary>
  );
};

export default Page;
