'use server';

import { BoxError } from '@/shared/ui';
import { getUser } from '@/entities/user/api';
import { getPosts } from '@/entities/post/api';
import { queryKey } from '../provider/query/lib';
import { AsyncBoundary } from '@/shared/boundary';
import { BlogPostList } from '@/entities/post/ui';
import { PostPagination } from '@/entities/post/ui';
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
  const user = await queryClient.ensureQueryData(userQueryOptions);

  if (!user.ok) {
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
  const posts = await queryClient.ensureQueryData(postsQueryOptions);

  if (!posts.ok) {
    throw new Error('Posts fetch error');
  }

  const totalPageNum = posts.data?.[0]?.totalItems ?? 0;

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <AsyncBoundary pending={<div>Loading...</div>} error={<BoxError height={500} />}>
        <BlogPostList author={user.data} posts={posts.data} />
      </AsyncBoundary>
      <AsyncBoundary pending={<div>Loading...</div>} error={<BoxError height={35} />}>
        <PostPagination totalPageNum={totalPageNum} />
      </AsyncBoundary>
    </HydrationBoundary>
  );
};

export default Page;
