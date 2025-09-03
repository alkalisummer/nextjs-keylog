'use server';

import { View } from './ui/View';
import { PostHashtags as hashtags } from '@/entities/hashtag/model';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface Props {
  promise: {
    hashtags: Promise<ApiResponse<hashtags[]>>;
  };
  postId: number;
}

export const PostHashtags = async ({ promise, postId }: Props) => {
  const queryClient = new QueryClient();

  const hashtagsQueryOptions = {
    queryKey: queryKey().hashtag().postHashtags(postId),
    queryFn: () => promise.hashtags,
  };

  await queryClient.prefetchQuery(hashtagsQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <View postId={postId} />
    </HydrationBoundary>
  );
};
