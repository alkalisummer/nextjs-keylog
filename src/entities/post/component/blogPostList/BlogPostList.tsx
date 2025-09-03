'use server';

import { View } from './ui/View';
import { Post } from '@/entities/post/model';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface Props {
  promise: {
    posts: Promise<ApiResponse<Post[]>>;
  };
  userId: string;
  pageNum: string;
  tagId: string;
  tempYn: string;
}

export const BlogPostList = async ({ promise, userId, pageNum, tagId, tempYn }: Props) => {
  const queryClient = new QueryClient();

  const postsQueryOptions = {
    queryKey: queryKey()
      .post()
      .postList({ currPageNum: Number(pageNum), authorId: userId, tagId, tempYn }),
    queryFn: () => promise.posts,
  } as const;

  await queryClient.prefetchQuery(postsQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <View userId={userId} />
    </HydrationBoundary>
  );
};
