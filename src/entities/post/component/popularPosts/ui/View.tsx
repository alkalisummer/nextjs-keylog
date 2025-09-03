'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import css from './view.module.scss';
import { PopularPost } from '@/entities/post/model';
import { timeFormat } from '@/utils/CommonUtils';
import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/app/provider/query/lib';
import { getPopularPosts } from '@/entities/post/api';

interface Props {
  userId: string;
}

export const View = ({ userId }: Props) => {
  const router = useRouter();

  const { data: popularPostsRes } = useQuery({
    queryKey: queryKey().post().popularPost(userId),
    queryFn: () => getPopularPosts(userId),
  });

  const popularPosts = popularPostsRes?.data;

  return (
    <div className={css.module}>
      <span className={css.title}>인기 글</span>
      {popularPosts?.map((post: PopularPost) => (
        <div key={`post_${post.postId}`} className={css.item} onClick={() => router.push(`/${userId}/${post.postId}`)}>
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

export default View;
