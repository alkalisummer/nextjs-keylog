'use client';

import { useState } from 'react';
import css from './hashtagButtons.module.scss';
import { HashtagInfo } from '@/entities/hashtag/model';
import { useHashtagRouter } from '@/entities/hashtag/hook';

interface HashtagButtonsProps {
  hashtags: HashtagInfo[];
  userId: string;
}

export const HashtagButtons = ({ hashtags, userId }: HashtagButtonsProps) => {
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const router = useHashtagRouter({ userId, setHashtagId: setSelectedTag });

  return (
    <div className={css.module}>
      {hashtags.map(tag => (
        <button key={tag.hashtagId} className={css.button} onClick={() => router.route(tag.hashtagId)}>
          {tag.hashtagName}
        </button>
      ))}
    </div>
  );
};
