'use server';

import { View } from './ui/View';
import { PopularPost } from '@/entities/post/model';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface Props {
  promise: {
    popularPosts: Promise<ApiResponse<PopularPost[]>>;
  };
  userId: string;
}

export const PopularPosts = async ({ promise, userId }: Props) => {
  const queryClient = new QueryClient();

  const popularPostsQueryOptions = {
    queryKey: queryKey().post().popularPost(userId),
    queryFn: () => promise.popularPosts,
  };
  await queryClient.prefetchQuery(popularPostsQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <View userId={userId} />
    </HydrationBoundary>
  );
};
