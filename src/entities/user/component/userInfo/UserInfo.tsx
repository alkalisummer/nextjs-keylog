import { View } from './ui/View';
import { User } from '@/entities/user/model';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HydrateClient } from '@/app/provider/query/lib/HydrateClient';

interface Props {
  promise: {
    authorInfo: Promise<ApiResponse<User>>;
  };
  userId: string;
}

export const UserInfo = async ({ promise, userId }: Props) => {
  const queryClient = new QueryClient();

  const userInfoQueryOptions = {
    queryKey: queryKey().user().userInfo(userId),
    queryFn: () => promise.authorInfo,
  };
  await queryClient.prefetchQuery(userInfoQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateClient state={dehydratedState}>
      <View userId={userId} />
    </HydrateClient>
  );
};
