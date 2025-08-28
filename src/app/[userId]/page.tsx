'use server';

import { getUser } from '@/entities/user/api';
import { getPosts } from '@/entities/post/api';
import { queryKey } from '../provider/query/lib';
import { PostUserInfo } from '@/entities/user/ui';
import { getAuthorHashtags } from '@/entities/hashtag/api';
import { BlogPostList, BlogPostHeader } from '@/entities/post/ui';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ pageNum: string; tagId: string; tempYn: string }>;
}) => {
  const [{ userId }, { pageNum = '1', tagId = '', tempYn = 'N' }] = await Promise.all([params, searchParams]);
  const queryClient = new QueryClient();

  const userQueryOptions = {
    queryKey: queryKey().user().userInfo(userId),
    queryFn: () => getUser(userId),
  };
  const userRes = await queryClient.ensureQueryData(userQueryOptions);

  if (!userRes.ok) {
    throw new Error('User fetch error');
  }

  //posts init data
  const postsQueryOptions = {
    queryKey: queryKey()
      .post()
      .postList({ currPageNum: Number(pageNum), authorId: userId, tagId: tagId, tempYn: tempYn }),
    queryFn: () => getPosts({ currPageNum: Number(pageNum), authorId: userId, tagId: tagId, tempYn: tempYn }),
  };

  await queryClient.prefetchQuery(postsQueryOptions);

  //hashtags
  const hashtagQueryOptions = {
    queryKey: queryKey().hashtag().hashtagList(userId),
    queryFn: () => getAuthorHashtags(userId),
  };

  const hashtagRes = await queryClient.ensureQueryData(hashtagQueryOptions);
  if (!hashtagRes.ok) throw new Error('hashtag fetch error');

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostUserInfo author={userRes.data} />
      <BlogPostHeader hashtags={hashtagRes.data} userId={userRes.data.userId} />
      <BlogPostList author={userRes.data} />
    </HydrationBoundary>
  );
};

export default Page;
