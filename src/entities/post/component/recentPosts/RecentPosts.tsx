'use server';

import { View } from './ui/View';
import { RecentPost } from '@/entities/post/model';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HydrateClient } from '@/app/provider/query/lib/HydrateClient';

interface Props {
  promise: {
    recentPosts: Promise<ApiResponse<RecentPost[]>>;
  };
  userId: string;
}

export const RecentPosts = async ({ promise, userId }: Props) => {
  const queryClient = new QueryClient();

  const recentPostsQueryOptions = {
    queryKey: queryKey().post().recentPost(userId),
    queryFn: () => promise.recentPosts,
  };
  await queryClient.prefetchQuery(recentPostsQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateClient state={dehydratedState}>
      <View userId={userId} />
    </HydrateClient>
  );
};
