'use client';

import Link from 'next/link';
import { getAuthorHashtags } from '../../api';
import css from './postListHashtags.module.scss';
import { useQuery } from '@tanstack/react-query';
import { useBlog } from '@/app/[userId]/container';
import { queryKey } from '@/app/provider/query/lib';
import { HashtagInfo } from '@/entities/hashtag/model';

interface HashtagButtonsProps {
  userId: string;
}

export const PostListHashtags = ({ userId }: HashtagButtonsProps) => {
  const { selectedHashtag, setSelectedHashtag } = useBlog();

  const { data: hashtagsRes } = useQuery({
    queryKey: queryKey().hashtag().hashtagList(userId),
    queryFn: () => getAuthorHashtags(userId),
  });

  if (!hashtagsRes?.ok) {
    throw new Error('Hashtags fetch error');
  }

  const hashtags = hashtagsRes.data;

  const allHashtags = [
    ...hashtags.filter(tag => tag.hashtagId !== null), // null이 아닌 항목만 필터링
  ];

  const allHashtagsCnt = allHashtags.reduce((acc, hashtag) => acc + Number(hashtag.hashtagCnt), 0);

  return (
    <div className={css.module}>
      <div className={css.hashtags}>
        <Link
          href={`/${userId}`}
          className={`${css.button} ${selectedHashtag === null ? css.allPosts : ''} ${
            selectedHashtag === null ? css.selected : ''
          }`}
          onClick={() => setSelectedHashtag(null)}
        >
          {`전체 (${allHashtagsCnt})`}
        </Link>
        {allHashtags.map((hashtag: HashtagInfo, index) => (
          <Link
            key={hashtag.hashtagId ?? `all-${index}`}
            className={`${css.button} ${hashtag.hashtagId === null ? css.allPosts : ''} ${
              selectedHashtag === hashtag.hashtagId ? css.selected : ''
            }`}
            href={`/${userId}?tagId=${hashtag.hashtagId}`}
          >
            {`${hashtag.hashtagName}${hashtag.hashtagCnt ? ` (${hashtag.hashtagCnt})` : ''} `}
          </Link>
        ))}
      </div>
    </div>
  );
};
