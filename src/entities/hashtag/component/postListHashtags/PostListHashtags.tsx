'use client';

import { getAuthorHashtags } from '../../api';
import css from './postListHashtags.module.scss';
import { useQuery } from '@tanstack/react-query';
import { useBlog } from '@/app/[userId]/container';
import { queryKey } from '@/app/provider/query/lib';
import { HashtagInfo } from '@/entities/hashtag/model';
import { useHashtagRouter } from '@/entities/hashtag/hooks';

interface HashtagButtonsProps {
  userId: string;
}

export const PostListHashtags = ({ userId }: HashtagButtonsProps) => {
  const { selectedHashtag, setSelectedHashtag } = useBlog();
  const router = useHashtagRouter({ userId, setSelectedHashtag });

  const { data: hashtagsRes } = useQuery({
    queryKey: queryKey().hashtag().hashtagList(userId),
    queryFn: () => getAuthorHashtags(userId),
  });

  if (!hashtagsRes?.ok) {
    throw new Error('Hashtags fetch error');
  }

  const hashtags = hashtagsRes.data;

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
