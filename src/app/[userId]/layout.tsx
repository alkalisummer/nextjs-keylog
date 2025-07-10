'use server';
import { ReactNode } from 'react';
import { getUser } from '@/entities/user/api';
import { queryKey } from '../provider/query/lib';
import { Header, Sidebar, Footer, Article } from '@/widgets';
import { getRecentPosts } from '@/entities/post/api';
import { getHashtags } from '@/entities/hashtag/api';
import { getPopularPosts } from '@/entities/post/api';
import { getRecentComments } from '@/entities/comment/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

const Layout = async ({ children, params }: { children: ReactNode; params: Promise<{ userId: string }> }) => {
  const { userId } = await params;

  const queryClient = new QueryClient();

  //author info
  const userQueryOptions = {
    queryKey: queryKey().user().userInfo(userId),
    queryFn: () => getUser(userId),
  };
  await queryClient.prefetchQuery(userQueryOptions);
  const user = await queryClient.ensureQueryData(userQueryOptions);
  if (!user.ok) throw new Error('user fetch error');

  //recent post
  const recentPostQueryOptions = {
    queryKey: queryKey().post().recentPost(userId),
    queryFn: () => getRecentPosts(userId),
  };
  await queryClient.prefetchQuery(recentPostQueryOptions);
  const recentPost = await queryClient.ensureQueryData(recentPostQueryOptions);
  if (!recentPost.ok) throw new Error('recent post fetch error');

  //popular posts
  const popularPostQueryOptions = {
    queryKey: queryKey().post().popularPost(userId),
    queryFn: () => getPopularPosts(userId),
  };
  await queryClient.prefetchQuery(popularPostQueryOptions);
  const popularPost = await queryClient.ensureQueryData(popularPostQueryOptions);
  if (!popularPost.ok) throw new Error('popular post fetch error');

  //recent comments
  const recentCommentQueryOptions = {
    queryKey: queryKey().comment().recentComment(userId),
    queryFn: () => getRecentComments(userId),
  };
  await queryClient.prefetchQuery(recentCommentQueryOptions);
  const recentComment = await queryClient.ensureQueryData(recentCommentQueryOptions);
  if (!recentComment.ok) throw new Error('recent comment fetch error');

  //hashtags
  const hashtagQueryOptions = {
    queryKey: queryKey().hashtag().hashtagList(userId),
    queryFn: () => getHashtags(userId),
  };
  await queryClient.prefetchQuery(hashtagQueryOptions);
  const hashtag = await queryClient.ensureQueryData(hashtagQueryOptions);
  if (!hashtag.ok) throw new Error('hashtag fetch error');

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Header />
      <Sidebar
        userInfo={user.data}
        recentPosts={recentPost.data}
        popularPosts={popularPost.data}
        recentComments={recentComment.data}
        hashtags={hashtag.data}
      />
      <Article>{children}</Article>
      <Footer />
    </HydrationBoundary>
  );
};

export default Layout;
