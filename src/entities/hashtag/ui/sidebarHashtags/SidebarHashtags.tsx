'use client';

import React from 'react';
import css from './sidebarHashtags.module.scss';
import { Post } from '@/entities/post/model/type';
import { HashtagInfo } from '@/entities/hashtag/model';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { useHashtagRouter } from '@/entities/hashtag/hooks';
import { useBlog } from '@/app/[userId]/container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface HashtagsProps {
  hashtags: HashtagInfo[];
  userId: string;
  posts: Post[];
}

export const SidebarHashtags = ({ hashtags, userId, posts }: HashtagsProps) => {
  const { selectedHashtag, setSelectedHashtag } = useBlog();
  const router = useHashtagRouter({ userId, setSelectedHashtag });
  const totalPostCnt = posts[0]?.totalItems ?? 0;

  return (
    <div className={css.module}>
      <span className={css.title}>태그 목록</span>
      {hashtags.length > 0 && (
        <span className={css.hashtag} onClick={() => router.route(null)}>
          전체보기 <span className={css.count}>&nbsp;{`(${totalPostCnt})`}</span>
        </span>
      )}
      {hashtags.map((hashtag: HashtagInfo) => (
        <span key={hashtag.hashtagId} className={css.hashtag} onClick={() => router.route(hashtag.hashtagId)}>
          <FontAwesomeIcon icon={faTag} className={css.icon} />
          <span className={css.name}>{hashtag.hashtagName}</span>
          <span className={css.count}>&nbsp;{`(${hashtag.hashtagCnt})`}</span>
        </span>
      ))}
    </div>
  );
};
