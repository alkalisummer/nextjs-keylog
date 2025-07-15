'use client';

import React from 'react';
import { useState } from 'react';
import css from './hashtags.module.scss';
import { useRouter } from 'next/navigation';
import { Post } from '@/entities/post/model/type';
import { HashtagInfo } from '@/entities/hashtag/model';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { useHashtagRouter } from '@/entities/hashtag/hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface HashtagsProps {
  hashtags: HashtagInfo[];
  userId: string;
  posts: Post[];
}

export const Hashtags = ({ hashtags, userId, posts }: HashtagsProps) => {
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const router = useHashtagRouter({ userId, setHashtagId: setSelectedTag });
  const totalPostCnt = posts[0]?.totalItems ?? 0;

  return (
    <div className={css.module}>
      <span className={css.title}>태그 목록</span>
      {hashtags.length > 0 && (
        <span
          className={`${css.hashtag} ${selectedTag === null ? css.selected : ''}`}
          onClick={() => router.route(null)}
        >
          전체보기 <span className={css.count}>&nbsp;{`(${totalPostCnt})`}</span>
        </span>
      )}
      {hashtags.map((tag: HashtagInfo) => (
        <span
          key={tag.hashtagId}
          className={`${css.hashtag} ${selectedTag === tag.hashtagId ? css.selected : ''}`}
          onClick={() => router.route(tag.hashtagId)}
        >
          <FontAwesomeIcon icon={faTag} className={css.icon} />
          <span className={css.name}>{tag.hashtagName}</span>
          <span className={css.count}>&nbsp;{`(${tag.hashtagCnt})`}</span>
        </span>
      ))}
    </div>
  );
};
