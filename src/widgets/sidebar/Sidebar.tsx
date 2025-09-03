'use server';

import css from './sidebar.module.scss';
import { getUser } from '@/entities/user/api';
import { UserInfo } from '@/entities/user/component';
import { getPopularPosts } from '@/entities/post/api';
import { RecentComments } from '@/entities/comment/ui';
import { SidebarHashtags } from '@/entities/hashtag/component';
import { getAuthorHashtags } from '@/entities/hashtag/api';
import { getRecentComments } from '@/entities/comment/api';
import { RecentPosts, PopularPosts } from '@/entities/post/component';
import { getPosts, getRecentPosts } from '@/entities/post/api';

interface Props {
  userId: string;
}

export const Sidebar = async ({ userId }: Props) => {
  const authorInfo = getUser(userId);
  const recentPosts = getRecentPosts(userId);
  const popularPosts = getPopularPosts(userId);
  const recentComments = getRecentComments(userId);
  const hashtags = getAuthorHashtags(userId);
  const posts = getPosts({ currPageNum: 1, authorId: userId });

  return (
    <aside className={css.module}>
      <div className={css.leftArea}>
        <UserInfo promise={{ authorInfo }} userId={userId} />
        <RecentPosts promise={{ recentPosts }} userId={userId} />
        <PopularPosts promise={{ popularPosts }} userId={userId} />
        <RecentComments promise={{ recentComments }} userId={userId} />
        <SidebarHashtags promise={{ hashtags, posts }} userId={userId} />
      </div>
    </aside>
  );
};
