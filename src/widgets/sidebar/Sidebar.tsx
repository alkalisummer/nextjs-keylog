'use client';

import React from 'react';
import css from './sidebar.module.scss';
import { User } from '@/entities/user/model';
import { UserInfo } from '@/entities/user/ui';
import { Hashtags } from '@/entities/hashtag/ui';
import { HashtagInfo } from '@/entities/hashtag/model';
import { RecentComments } from '@/entities/comment/ui';
import { RecentComment } from '@/entities/comment/model';
import { RecentPosts, PopularPosts } from '@/entities/post/ui';
import { RecentPost, PopularPost } from '@/entities/post/model';

interface SidebarProps {
  userInfo: User;
  hashtags: HashtagInfo[];
  recentPosts: RecentPost[];
  popularPosts: PopularPost[];
  recentComments: RecentComment[];
}

export const Sidebar = ({ userInfo, recentPosts, popularPosts, recentComments, hashtags }: SidebarProps) => {
  const userId = userInfo.userId;

  return (
    <aside className={css.module}>
      <div className={css.leftArea}>
        <UserInfo userInfo={userInfo} />
        <RecentPosts recentPosts={recentPosts} userId={userId} />
        <PopularPosts popularPosts={popularPosts} userId={userId} />
        <RecentComments recentComments={recentComments} userId={userId} />
        <Hashtags hashtags={hashtags} userId={userId} />
      </div>
    </aside>
  );
};

export default Sidebar;
