'use server';

import { View } from './ui/View';
import { PostHashtags as hashtags } from '@/entities/hashtag/model';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HydrateClient } from '@/app/provider/query/lib/HydrateClient';

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
    <HydrateClient state={dehydratedState}>
      <View postId={postId} />
    </HydrateClient>
  );
};
