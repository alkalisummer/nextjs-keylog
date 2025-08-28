'use client';

import React from 'react';
import css from './sidebar.module.scss';
import { useParams } from 'next/navigation';
import { getUser } from '@/entities/user/api';
import { UserInfo } from '@/entities/user/ui';
import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/app/provider/query/lib';
import { RecentComments } from '@/entities/comment/ui';
import { SidebarHashtags } from '@/entities/hashtag/ui';
import { getRecentComments } from '@/entities/comment/api';
import { getAuthorHashtags } from '@/entities/hashtag/api';
import { RecentPosts, PopularPosts } from '@/entities/post/ui';
import { getPopularPosts, getPosts, getRecentPosts } from '@/entities/post/api';

export const Sidebar = () => {
  const params = useParams();
  const userId = params?.userId as string;

  const { data: userInfo } = useQuery({
    queryKey: queryKey().user().userInfo(userId),
    queryFn: () => getUser(userId),
  });

  if (!userInfo?.ok) {
    throw new Error('User fetch found');
  }

  const { data: recentPosts } = useQuery({
    queryKey: queryKey().post().recentPost(userId),
    queryFn: () => getRecentPosts(userId),
  });

  if (!recentPosts?.ok) {
    throw new Error('Recent posts fetch found');
  }

  const { data: popularPosts } = useQuery({
    queryKey: queryKey().post().popularPost(userId),
    queryFn: () => getPopularPosts(userId),
  });

  if (!popularPosts?.ok) {
    throw new Error('Popular posts fetch found');
  }

  const { data: recentComments } = useQuery({
    queryKey: queryKey().comment().recentComment(userId),
    queryFn: () => getRecentComments(userId),
  });

  if (!recentComments?.ok) {
    throw new Error('Recent comments fetch found');
  }

  const { data: hashtags } = useQuery({
    queryKey: queryKey().hashtag().hashtagList(userId),
    queryFn: () => getAuthorHashtags(userId),
  });

  if (!hashtags?.ok) {
    throw new Error('Hashtags fetch found');
  }

  const { data: posts } = useQuery({
    queryKey: queryKey().post().postList({ currPageNum: 1, authorId: userId }),
    queryFn: () => getPosts({ currPageNum: 1, authorId: userId }),
  });

  if (!posts?.ok) {
    throw new Error('Posts fetch found');
  }

  return (
    <aside className={css.module}>
      <div className={css.leftArea}>
        <UserInfo userInfo={userInfo.data} />
        <RecentPosts recentPosts={recentPosts.data} userId={userId} />
        <PopularPosts popularPosts={popularPosts.data} userId={userId} />
        <RecentComments recentComments={recentComments.data} userId={userId} />
        <SidebarHashtags hashtags={hashtags.data} userId={userId} posts={posts.data} />
      </div>
    </aside>
  );
};

export default Sidebar;
