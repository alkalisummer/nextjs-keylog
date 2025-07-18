'use server';

import { BoxError } from '@/shared/ui';
import { getUser } from '@/entities/user/api';
import { getPosts } from '@/entities/post/api';
import { queryKey } from '../provider/query/lib';
import { AsyncBoundary } from '@/shared/boundary';
import { PostUserInfo } from '@/entities/user/ui';
import { BlogPostList } from '@/entities/post/ui';
import { BlogPostHeader } from '@/entities/post/ui';
import { HashtagButtons } from '@/entities/hashtag/ui';
import { getAuthorHashtags } from '@/entities/hashtag/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ pageNum: string; tagId: string }>;
}) => {
  const [{ userId }, { pageNum = '1', tagId = '' }] = await Promise.all([params, searchParams]);
  const queryClient = new QueryClient();

  const userQueryOptions = {
    queryKey: queryKey().user().userInfo(userId),
    queryFn: () => getUser(userId),
  };
  await queryClient.prefetchQuery(userQueryOptions);
  const userRes = await queryClient.ensureQueryData(userQueryOptions);

  if (!userRes.ok) {
    throw new Error('User fetch error');
  }

  //posts init data
  const postsQueryOptions = {
    queryKey: queryKey()
      .post()
      .postList({ currPageNum: Number(pageNum), authorId: userId, tagId: tagId }),
    queryFn: () => getPosts({ currPageNum: Number(pageNum), authorId: userId, tagId: tagId }),
  };

  await queryClient.prefetchQuery(postsQueryOptions);
  const postsRes = await queryClient.ensureQueryData(postsQueryOptions);

  if (!postsRes.ok) {
    throw new Error('Posts fetch error');
  }

  //hashtags
  const hashtagQueryOptions = {
    queryKey: queryKey().hashtag().hashtagList(userId),
    queryFn: () => getAuthorHashtags(userId),
  };
  await queryClient.prefetchQuery(hashtagQueryOptions);
  const hashtagRes = await queryClient.ensureQueryData(hashtagQueryOptions);
  if (!hashtagRes.ok) throw new Error('hashtag fetch error');

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <AsyncBoundary pending={<div>Loading...</div>} error={<BoxError height={500} />}>
        <PostUserInfo author={userRes.data} />
        <BlogPostHeader author={userRes.data} posts={postsRes.data} />
        <HashtagButtons hashtags={hashtagRes.data} userId={userRes.data.userId} />
        <BlogPostList author={userRes.data} posts={postsRes.data} />
      </AsyncBoundary>
    </HydrationBoundary>
  );
};

export default Page;
