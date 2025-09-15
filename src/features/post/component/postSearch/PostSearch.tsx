'use server';

import { View } from './ui/View';
import { getPosts } from '@/entities/post/api';
import { queryKey } from '@/app/provider/query/lib';
import { QueryClient } from '@tanstack/react-query';
import { dehydrate } from '@tanstack/react-query';
import { HydrateClient } from '@/app/provider/query/lib/HydrateClient';

interface Props {
  tagId: string;
}

export const PostSearch = async ({ tagId }: Props) => {
  const queryClient = new QueryClient();

  //posts init data
  const postsQueryOptions = {
    queryKey: queryKey().post().postList({ currPageNum: 1, tagId }),
    queryFn: () => getPosts({ currPageNum: 1, tagId }),
  };
  const postsRes = await queryClient.ensureQueryData(postsQueryOptions);

  if (!postsRes.ok) throw new Error('posts fetch error');

  const initPosts = postsRes.data;
  const initPostsTotalCnt = postsRes.data.length;

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateClient state={dehydratedState}>
      <View initPosts={initPosts} initPostsTotalCnt={initPostsTotalCnt} />
    </HydrateClient>
  );
};
