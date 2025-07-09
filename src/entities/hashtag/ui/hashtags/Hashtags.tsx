'use client';

import React from 'react';
import css from './hashtags.module.scss';
import { useRouter } from 'next/navigation';
import { HashtagInfo } from '@/entities/hashtag/model';

interface HashtagsProps {
  hashtags: HashtagInfo[];
  userId: string;
}

export const Hashtags = ({ hashtags, userId }: HashtagsProps) => {
  const router = useRouter();

  let tagTotalCnt = 0;

  for (const hashtag of hashtags) {
    tagTotalCnt += Number(hashtag.hashtagCnt);
  }

  return (
    <div className={css.module}>
      <span className={css.title}>태그 목록</span>
      {hashtags.length > 0 && (
        <span className={css.hashtag} onClick={() => router.push(`/${userId}`)}>
          전체 <span className={css.count}>{` (${tagTotalCnt})`}</span>
        </span>
      )}
      {hashtags.map((tag: HashtagInfo) => (
        <span
          key={tag.hashtagId}
          className={css.hashtag}
          onClick={() => router.push(`/${userId}?tagId=${tag.hashtagId}`)}
        >
          <span className={css.name}>{tag.hashtagName}</span>
          <span className={css.count}>{` (${tag.hashtagCnt})`}</span>
        </span>
      ))}
    </div>
  );
};
