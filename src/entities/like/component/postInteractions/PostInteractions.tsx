import { queryKey } from '@/app/provider/query/lib';
import { View } from './ui/View';
import { PostDetail } from '@/entities/post/model';
import { ApiResponse } from '@/shared/lib/client/type';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface Props {
  promise: {
    post: Promise<ApiResponse<PostDetail>>;
  };
  postId: number;
}

export const PostInteractions = async ({ promise, postId }: Props) => {
  const queryClient = new QueryClient();

  const postTitleQueryOptions = {
    queryKey: queryKey().post().postDetail(postId),
    queryFn: () => promise.post,
  };

  const postRes = await queryClient.ensureQueryData(postTitleQueryOptions);

  if (!postRes.ok) throw new Error('postTitle fetch error');

  const postTitle = postRes.data.postTitle;

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <View postId={postId} postTitle={postTitle} />
    </HydrationBoundary>
  );
};
