'use client';

import React from 'react';
import css from './view.module.scss';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/shared/lib/util';
import { RecentPost } from '@/entities/post/model';
import { queryKey } from '@/app/provider/query/lib';
import { getRecentPosts } from '@/entities/post/api';
import { useSuspenseQuery } from '@tanstack/react-query';

interface Props {
  userId: string;
}

export const View = ({ userId }: Props) => {
  const router = useRouter();

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
        <div key={`post_${post.postId}`} className={css.item} onClick={() => router.push(`/${userId}/${post.postId}`)}>
          <div className={css.info}>
            <span className={css.postTitle}>{post.postTitle}</span>
            <span className={css.date}>{formatDate({ date: post.rgsnDttm, seperator: '.', isExtendTime: true })}</span>
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

export default View;
