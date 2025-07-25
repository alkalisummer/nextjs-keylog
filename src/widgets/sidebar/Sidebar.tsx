'use client';

import React from 'react';
import css from './sidebar.module.scss';
import { User } from '@/entities/user/model';
import { UserInfo } from '@/entities/user/ui';
import { Post } from '@/entities/post/model/type';
import { Comment } from '@/entities/comment/model';
import { HashtagInfo } from '@/entities/hashtag/model';
import { RecentComments } from '@/entities/comment/ui';
import { SidebarHashtags } from '@/entities/hashtag/ui';
import { RecentPosts, PopularPosts } from '@/entities/post/ui';
import { RecentPost, PopularPost } from '@/entities/post/model';

interface SidebarProps {
  userInfo: User;
  hashtags: HashtagInfo[];
  recentPosts: RecentPost[];
  popularPosts: PopularPost[];
  recentComments: Partial<Comment>[];
  posts: Post[];
}

export const Sidebar = ({ userInfo, recentPosts, popularPosts, recentComments, hashtags, posts }: SidebarProps) => {
  const userId = userInfo.userId;

  return (
    <aside className={css.module}>
      <div className={css.leftArea}>
        <UserInfo userInfo={userInfo} />
        <RecentPosts recentPosts={recentPosts} userId={userId} />
        <PopularPosts popularPosts={popularPosts} userId={userId} />
        <RecentComments recentComments={recentComments} userId={userId} />
        <SidebarHashtags hashtags={hashtags} userId={userId} posts={posts} />
      </div>
    </aside>
  );
};

export default Sidebar;
