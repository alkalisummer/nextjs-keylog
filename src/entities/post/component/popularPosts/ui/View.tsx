'use client';

import React from 'react';
import Link from 'next/link';
import css from './view.module.scss';
import { formatDate } from '@/shared/lib/util';
import { PopularPost } from '@/entities/post/model';
import { queryKey } from '@/app/provider/query/lib';
import { getPopularPosts } from '@/entities/post/api';
import { useSuspenseQuery } from '@tanstack/react-query';

interface Props {
  userId: string;
}

export const View = ({ userId }: Props) => {
  const { data: popularPostsRes } = useSuspenseQuery({
    queryKey: queryKey().post().popularPost(userId),
    queryFn: () => getPopularPosts(userId),
  });

  const popularPosts = popularPostsRes?.data;

  return (
    <div className={css.module}>
      <span className={css.title}>인기 글</span>
      {popularPosts?.map((post: PopularPost) => (
        <Link key={`post_${post.postId}`} href={`/${userId}/${post.postId}`} className={css.item}>
          <div className={css.info}>
            <span className={css.postTitle}>{post.postTitle}</span>
            <span className={css.date}>{formatDate({ date: post.rgsnDttm, seperator: '.', isExtendTime: true })}</span>
          </div>
          {post.postThmbImgUrl && (
            <div className={css.postImgDiv}>
              <img className={css.postImg} src={post.postThmbImgUrl} alt="postImg" />
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

export default View;
