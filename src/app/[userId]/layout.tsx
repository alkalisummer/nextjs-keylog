'use server';
import { ReactNode } from 'react';
import { BlogContainer } from './container';
import { getUser } from '@/entities/user/api';
import { queryKey } from '../provider/query/lib';
import { Header, Sidebar, Article } from '@/widgets';
import { getPopularPosts } from '@/entities/post/api';
import { getAuthorHashtags } from '@/entities/hashtag/api';
import { getRecentComments } from '@/entities/comment/api';
import { getPosts, getRecentPosts } from '@/entities/post/api';
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

  //recent post
  const recentPostQueryOptions = {
    queryKey: queryKey().post().recentPost(userId),
    queryFn: () => getRecentPosts(userId),
  };
  await queryClient.prefetchQuery(recentPostQueryOptions);

  //popular posts
  const popularPostQueryOptions = {
    queryKey: queryKey().post().popularPost(userId),
    queryFn: () => getPopularPosts(userId),
  };
  await queryClient.prefetchQuery(popularPostQueryOptions);

  //recent comments
  const recentCommentQueryOptions = {
    queryKey: queryKey().comment().recentComment(userId),
    queryFn: () => getRecentComments(userId),
  };
  await queryClient.prefetchQuery(recentCommentQueryOptions);

  //hashtags
  const hashtagQueryOptions = {
    queryKey: queryKey().hashtag().hashtagList(userId),
    queryFn: () => getAuthorHashtags(userId),
  };
  await queryClient.prefetchQuery(hashtagQueryOptions);

  //posts
  const postsQueryOptions = {
    queryKey: queryKey().post().postList({ currPageNum: 1, authorId: userId }),
    queryFn: () => getPosts({ currPageNum: 1, authorId: userId }),
  };
  await queryClient.prefetchQuery(postsQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <BlogContainer>
        <Header type="blog" />
        <Sidebar />
        <Article>{children}</Article>
      </BlogContainer>
    </HydrationBoundary>
  );
};

export default Layout;
