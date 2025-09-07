'use client';

import React from 'react';
import css from './view.module.scss';
import { getPosts } from '@/entities/post/api';
import { Post } from '@/entities/post/model/type';
import { useBlog } from '@/app/[userId]/container';
import { queryKey } from '@/app/provider/query/lib';
import { HashtagInfo } from '@/entities/hashtag/model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { getAuthorHashtags } from '@/entities/hashtag/api';
import { useHashtagRouter } from '@/entities/hashtag/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  userId: string;
}

export const View = ({ userId }: Props) => {
  const { setSelectedHashtag } = useBlog();
  const router = useHashtagRouter({ userId, setSelectedHashtag });

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

export default View;
