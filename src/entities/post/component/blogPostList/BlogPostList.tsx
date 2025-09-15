'use server';

import { View } from './ui/View';
import { Post } from '@/entities/post/model';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HydrateClient } from '@/app/provider/query/lib/HydrateClient';

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
    <HydrateClient state={dehydratedState}>
      <View userId={userId} />
    </HydrateClient>
  );
};
