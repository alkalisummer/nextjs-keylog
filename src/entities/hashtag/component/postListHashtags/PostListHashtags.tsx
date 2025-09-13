'use client';

import Link from 'next/link';
import css from './postListHashtags.module.scss';
import { useSearchParams } from 'next/navigation';
import { HashtagInfo } from '@/entities/hashtag/model';

interface HashtagButtonsProps {
  userId: string;
  hashtags: HashtagInfo[];
}

export const PostListHashtags = ({ userId, hashtags }: HashtagButtonsProps) => {
  const searchParams = useSearchParams();
  const tagId = Number(searchParams?.get('tagId')) || null;

  const allHashtags = [
    ...hashtags.filter(tag => tag.hashtagId !== null), // null이 아닌 항목만 필터링
  ];

  const allHashtagsCnt = allHashtags.reduce((acc, hashtag) => acc + Number(hashtag.hashtagCnt), 0);

  return (
    <div className={css.module}>
      <div className={css.hashtags}>
        <Link href={`/${userId}`} className={`${css.button} ${tagId === null ? css.selected : ''}`}>
          {`전체 (${allHashtagsCnt})`}
        </Link>
        {allHashtags.map((hashtag: HashtagInfo, index) => (
          <Link
            key={hashtag.hashtagId ?? `all-${index}`}
            className={`${css.button} ${tagId === hashtag.hashtagId ? css.selected : ''}`}
            href={`/${userId}?tagId=${hashtag.hashtagId}`}
          >
            {`${hashtag.hashtagName}${hashtag.hashtagCnt ? ` (${hashtag.hashtagCnt})` : ''} `}
          </Link>
        ))}
      </div>
    </div>
  );
};
