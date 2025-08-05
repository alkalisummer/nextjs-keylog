'use client';

import css from './postListHashtags.module.scss';
import { useBlog } from '@/app/[userId]/container';
import { HashtagInfo } from '@/entities/hashtag/model';
import { useHashtagRouter } from '@/entities/hashtag/hooks';

interface HashtagButtonsProps {
  hashtags: HashtagInfo[];
  userId: string;
}

export const PostListHashtags = ({ hashtags, userId }: HashtagButtonsProps) => {
  const { selectedHashtag, setSelectedHashtag } = useBlog();
  const router = useHashtagRouter({ userId, setSelectedHashtag });

  const allHashtags = [
    {
      hashtagId: null,
      hashtagName: '전체',
      hashtagCnt: 0,
    },
    ...hashtags.filter(tag => tag.hashtagId !== null), // null이 아닌 항목만 필터링
  ];

  return (
    <div className={css.module}>
      <div className={css.hashtags}>
        {allHashtags.map((hashtag: HashtagInfo, index) => (
          <button
            key={hashtag.hashtagId ?? `all-${index}`}
            className={`${css.button} ${hashtag.hashtagId === null ? css.allPosts : ''} ${
              selectedHashtag === hashtag.hashtagId ? css.selected : ''
            }`}
            onClick={() => router.route(hashtag.hashtagId ?? null)}
          >
            {`${hashtag.hashtagName}${hashtag.hashtagCnt ? ` (${hashtag.hashtagCnt})` : ''} `}
          </button>
        ))}
      </div>
    </div>
  );
};
