'use server';

import { View } from './ui/View';
import { ApiResponse } from '@/shared/lib/client';
import { PostDetail } from '@/entities/post/model';
import { queryKey } from '@/app/provider/query/lib';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface Props {
  promise: {
    post: Promise<ApiResponse<PostDetail>>;
  };
  userId: string;
  postId: number;
}

export const PostDetails = async ({ promise, userId, postId }: Props) => {
  const queryClient = new QueryClient();

  const postQueryOptions = {
    queryKey: queryKey().post().postDetail(postId),
    queryFn: () => promise.post,
    enabled: !!postId,
  };

  await queryClient.prefetchQuery(postQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <View userId={userId} postId={postId} />
    </HydrationBoundary>
  );
};
