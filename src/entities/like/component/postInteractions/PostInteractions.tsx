import { queryKey } from '@/app/provider/query/lib';
import { View } from './ui/View';
import { PostDetail } from '@/entities/post/model';
import { ApiResponse } from '@/shared/lib/client/type';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HydrateClient } from '@/app/provider/query/lib/HydrateClient';

interface Props {
  promise: {
    post: Promise<ApiResponse<PostDetail>>;
  };
  postId: number;
  authorId: string;
}

export const PostInteractions = async ({ promise, postId, authorId }: Props) => {
  const queryClient = new QueryClient();

  const postTitleQueryOptions = {
    queryKey: queryKey().post().postDetail(postId),
    queryFn: () => promise.post,
  };

  await queryClient.prefetchQuery(postTitleQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateClient state={dehydratedState}>
      <View postId={postId} authorId={authorId} />
    </HydrateClient>
  );
};
