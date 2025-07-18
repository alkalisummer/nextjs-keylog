'use client';

import { useState } from 'react';
import css from './hashtagButtons.module.scss';
import { HashtagInfo } from '@/entities/hashtag/model';
import { useHashtagRouter } from '@/entities/hashtag/hook';
import { useBlog } from '@/app/[userId]/container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

interface HashtagButtonsProps {
  hashtags: HashtagInfo[];
  userId: string;
}

export const HashtagButtons = ({ hashtags, userId }: HashtagButtonsProps) => {
  const { selectedHashtag, setSelectedHashtag } = useBlog();
  const [isOpen, setIsOpen] = useState(false);
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
      <span className={css.title} onClick={() => setIsOpen(!isOpen)}>
        태그 목록 &nbsp;
        {isOpen ? (
          <FontAwesomeIcon className={css.icon} icon={faCaretUp} />
        ) : (
          <FontAwesomeIcon className={css.icon} icon={faCaretDown} />
        )}
      </span>
      <div className={`${css.hashtags} ${isOpen ? css.open : ''}`}>
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
