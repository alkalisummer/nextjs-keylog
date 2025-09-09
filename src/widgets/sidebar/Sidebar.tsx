'use server';

import css from './sidebar.module.scss';
import { getUser } from '@/entities/user/api';
import { AsyncBoundary } from '@/shared/boundary';
import { BoxError, BoxSkeleton } from '@/shared/ui';
import { UserInfo } from '@/entities/user/component';
import { getPopularPosts } from '@/entities/post/api';
import { getAuthorHashtags } from '@/entities/hashtag/api';
import { getRecentComments } from '@/entities/comment/api';
import { RecentComments } from '@/entities/comment/component';
import { SidebarHashtags } from '@/entities/hashtag/component';
import { getPosts, getRecentPosts } from '@/entities/post/api';
import { RecentPosts, PopularPosts } from '@/entities/post/component';

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
        <AsyncBoundary pending={<BoxSkeleton height={166.5} />} error={<BoxError height={150} />}>
          <UserInfo promise={{ authorInfo }} userId={userId} />
        </AsyncBoundary>
        <AsyncBoundary pending={<BoxSkeleton height={166.5} />} error={<BoxError height={150} />}>
          <RecentPosts promise={{ recentPosts }} userId={userId} />
        </AsyncBoundary>
        <AsyncBoundary pending={<BoxSkeleton height={166.5} />} error={<BoxError height={150} />}>
          <PopularPosts promise={{ popularPosts }} userId={userId} />
        </AsyncBoundary>
        <AsyncBoundary pending={<BoxSkeleton height={166.5} />} error={<BoxError height={150} />}>
          <RecentComments promise={{ recentComments }} userId={userId} />
        </AsyncBoundary>
        <AsyncBoundary pending={<BoxSkeleton height={150} />} error={<BoxError height={150} />}>
          <SidebarHashtags promise={{ hashtags, posts }} userId={userId} />
        </AsyncBoundary>
      </div>
    </aside>
  );
};
