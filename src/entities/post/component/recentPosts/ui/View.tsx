'use client';

import React from 'react';
import Link from 'next/link';
import css from './view.module.scss';
import { formatDate } from '@/shared/lib/util';
import { RecentPost } from '@/entities/post/model';
import { queryKey } from '@/app/provider/query/lib';
import { getRecentPosts } from '@/entities/post/api';
import { useSuspenseQuery } from '@tanstack/react-query';

interface Props {
  userId: string;
}

export const View = ({ userId }: Props) => {
  const { data: recentPostsRes } = useSuspenseQuery({
    queryKey: queryKey().post().recentPost(userId),
    queryFn: () => getRecentPosts(userId),
  });

  if (!recentPostsRes?.ok) {
    throw new Error('Recent posts fetch error');
  }

  const recentPosts = recentPostsRes.data;

  return (
    <div className={css.module}>
      <span className={css.title}>최근 글</span>
      {recentPosts.map((post: RecentPost) => (
        <Link href={`/${userId}/${post.postId}`} key={`post_${post.postId}`}>
          <div className={css.item}>
            <div className={css.info}>
              <span className={css.postTitle}>{post.postTitle}</span>
              <span className={css.date}>
                {formatDate({ date: post.rgsnDttm, seperator: '.', isExtendTime: true })}
              </span>
            </div>
            {post.postThmbImgUrl && (
              <div className={css.postImgDiv}>
                <img className={css.postImg} src={post.postThmbImgUrl} alt="postImg" />
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default View;
