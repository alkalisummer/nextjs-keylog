'use server';

import { View } from './ui/View';
import { User } from '@/entities/user/model';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HydrateClient } from '@/app/provider/query/lib/HydrateClient';

interface Props {
  promise: {
    author: Promise<ApiResponse<User>>;
  };
  userId: string;
}

export const PostUserInfo = async ({ promise, userId }: Props) => {
  const queryClient = new QueryClient();

  const userQueryOptions = {
    queryKey: queryKey().user().userInfo(userId),
    queryFn: () => promise.author,
  };
  await queryClient.prefetchQuery(userQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateClient state={dehydratedState}>
      <View userId={userId} />
    </HydrateClient>
  );
};
