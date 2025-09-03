'use server';

import { View } from './ui/View';
import { Comment } from '@/entities/comment/model';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface Props {
  promise: {
    recentComments: Promise<ApiResponse<Partial<Comment>[]>>;
  };
  userId: string;
}

export const RecentComments = async ({ promise, userId }: Props) => {
  const queryClient = new QueryClient();

  const recentCommentsQueryOptions = {
    queryKey: queryKey().comment().recentComment(userId),
    queryFn: () => promise.recentComments,
  };
  await queryClient.prefetchQuery(recentCommentsQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <View userId={userId} />
    </HydrationBoundary>
  );
};
