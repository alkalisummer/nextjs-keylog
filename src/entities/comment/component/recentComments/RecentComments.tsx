'use server';

import { View } from './ui/View';
import { Comment } from '@/entities/comment/model';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HydrateClient } from '@/app/provider/query/lib/HydrateClient';

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
    <HydrateClient state={dehydratedState}>
      <View userId={userId} />
    </HydrateClient>
  );
};
