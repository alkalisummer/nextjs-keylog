'use server';

import { View } from './ui/View';
import { Post } from '@/entities/post/model/type';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { HashtagInfo } from '@/entities/hashtag/model';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HydrateClient } from '@/app/provider/query/lib/HydrateClient';

interface Props {
  promise: {
    hashtags: Promise<ApiResponse<HashtagInfo[]>>;
    posts: Promise<ApiResponse<Post[]>>;
  };
  userId: string;
}

export const SidebarHashtags = async ({ promise, userId }: Props) => {
  const queryClient = new QueryClient();

  const hashtagsQueryOptions = {
    queryKey: queryKey().hashtag().hashtagList(userId),
    queryFn: () => promise.hashtags,
  };
  const postsQueryOptions = {
    queryKey: queryKey().post().postList({ currPageNum: 1, authorId: userId }),
    queryFn: () => promise.posts,
  } as const;

  await Promise.all([queryClient.prefetchQuery(hashtagsQueryOptions), queryClient.prefetchQuery(postsQueryOptions)]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateClient state={dehydratedState}>
      <View userId={userId} />
    </HydrateClient>
  );
};
