'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import css from './popularPosts.module.scss';
import { PopularPost } from '@/entities/post/model';
import { timeFormat } from '@/utils/CommonUtils';

interface PopularPostsProps {
  popularPosts: PopularPost[];
  userId: string;
}

export const PopularPosts = ({ popularPosts, userId }: PopularPostsProps) => {
  const router = useRouter();

  return (
    <div className={css.module}>
      <span className={css.title}>인기 글</span>
      {popularPosts.map((post: PopularPost) => (
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
