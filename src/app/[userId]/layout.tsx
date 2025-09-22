import { ReactNode } from 'react';
import type { Viewport } from 'next';
import { getUser } from '@/entities/user/api';
import { User } from '@/entities/user/model/type';
import { queryKey } from '@/app/provider/query/lib';
import { Header, Sidebar, Article } from '@/widgets';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HydrateClient } from '@/app/provider/query/lib/HydrateClient';

const Layout = async ({ children, params }: { children: ReactNode; params: Promise<{ userId: string }> }) => {
  const { userId } = await params;
  let author: User | undefined;
  const queryClient = new QueryClient();

  if (userId) {
    const authorQueryOptions = {
      queryKey: queryKey().user().userInfo(userId),
      queryFn: () => getUser(userId),
    };

    const authorRes = await queryClient.ensureQueryData(authorQueryOptions);
    author = authorRes.data;
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateClient state={dehydratedState}>
      <Header type="blog" authorId={userId} userNickname={author?.userNickname} />
      <Sidebar userId={userId} />
      <Article>{children}</Article>
    </HydrateClient>
  );
};

export default Layout;

export const viewport: Viewport = {
  themeColor: '#fff',
};
