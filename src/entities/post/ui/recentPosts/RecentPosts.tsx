'use client';

import React from 'react';
import css from './recentPosts.module.scss';
import { useRouter } from 'next/navigation';
import { timeFormat } from '@/utils/CommonUtils';
import { RecentPost } from '@/entities/post/model';

interface RecentPostsProps {
  recentPosts: RecentPost[];
  userId: string;
}

export const RecentPosts = ({ recentPosts, userId }: RecentPostsProps) => {
  const router = useRouter();

  return (
    <div className={css.module}>
      <span className={css.title}>최근 글</span>
      {recentPosts.map((post: RecentPost) => (
        <div
          key={`post_${post.postId}`}
          className={css.item}
          onClick={() => router.push(`/${userId}/posts/${post.postId}`)}
        >
          <div className={css.info}>
            <span className={css.postTitle}>{post.postTitle}</span>
            <span className={css.date}>{timeFormat(post.rgsnDttm)}</span>
          </div>
          {post.postThmbImgUrl && (
            <div className={css.postImgDiv}>
              <img className={css.postImg} src={post.postThmbImgUrl} alt="postImg" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
