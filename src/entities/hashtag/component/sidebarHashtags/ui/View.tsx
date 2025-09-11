'use client';

import React from 'react';
import Link from 'next/link';
import css from './view.module.scss';
import { getPosts } from '@/entities/post/api';
import { Post } from '@/entities/post/model/type';
import { queryKey } from '@/app/provider/query/lib';
import { HashtagInfo } from '@/entities/hashtag/model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { getAuthorHashtags } from '@/entities/hashtag/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  userId: string;
}

export const View = ({ userId }: Props) => {
  const { data: hashtagsRes } = useSuspenseQuery({
    queryKey: queryKey().hashtag().hashtagList(userId),
    queryFn: () => getAuthorHashtags(userId),
  });

  if (!hashtagsRes?.ok) {
    throw new Error('Hashtags fetch error');
  }

  const { data: postsRes } = useSuspenseQuery({
    queryKey: queryKey().post().postList({ currPageNum: 1, authorId: userId }),
    queryFn: () => getPosts({ currPageNum: 1, authorId: userId }),
  });

  if (!postsRes?.ok) {
    throw new Error('Posts fetch error');
  }

  const hashtags = hashtagsRes.data as HashtagInfo[];
  const posts = postsRes.data as Post[];
  const totalPostCnt = posts[0]?.totalItems ?? 0;

  return (
    <div className={css.module}>
      <span className={css.title}>태그 목록</span>
      {hashtags.length > 0 && (
        <Link href={`/${userId}`} className={css.hashtag}>
          전체보기 <span className={css.count}>&nbsp;{`(${totalPostCnt})`}</span>
        </Link>
      )}
      {hashtags.map((hashtag: HashtagInfo) => (
        <Link href={`/${userId}?tagId=${hashtag.hashtagId}`} key={hashtag.hashtagId}>
          <span className={css.hashtag}>
            <FontAwesomeIcon icon={faTag} className={css.icon} />
            <span className={css.name}>{hashtag.hashtagName}</span>
            <span className={css.count}>&nbsp;{`(${hashtag.hashtagCnt})`}</span>
          </span>
        </Link>
      ))}
    </div>
  );
};

export default View;
