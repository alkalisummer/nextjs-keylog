'use server';

import { View } from './ui/View';
import { User } from '@/entities/user/model';
import { ApiResponse } from '@/shared/lib/client';
import { PostDetail } from '@/entities/post/model';
import { queryKey } from '@/app/provider/query/lib';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface Props {
  promise: {
    user: Promise<ApiResponse<User>>;
    post: Promise<ApiResponse<PostDetail>>;
  };
  userId: string;
  postId: number;
}

export const PostDetails = async ({ promise, userId, postId }: Props) => {
  const queryClient = new QueryClient();

  const userQueryOptions = {
    queryKey: queryKey().user().userInfo(userId),
    queryFn: () => promise.user,
  };
  const postQueryOptions = {
    queryKey: queryKey().post().postDetail(postId),
    queryFn: () => promise.post,
  };

  await Promise.all([queryClient.prefetchQuery(userQueryOptions), queryClient.prefetchQuery(postQueryOptions)]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <View userId={userId} postId={postId} />
    </HydrationBoundary>
  );
};
