import { View } from './ui/View';
import { User } from '@/entities/user/model';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

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
    <HydrationBoundary state={dehydratedState}>
      <View userId={userId} />
    </HydrationBoundary>
  );
};
