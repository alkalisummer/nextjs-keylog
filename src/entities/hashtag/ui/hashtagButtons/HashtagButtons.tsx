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
  const [selectedHashtag, setSelectedHashtag] = useState<number | null>(null);
  const router = useHashtagRouter({ userId, setSelectedHashtag });

  return (
    <div className={css.module}>
      {hashtags.map((hashtag: HashtagInfo) => (
        <button key={hashtag.hashtagId} className={css.button} onClick={() => router.route(hashtag.hashtagId)}>
          {hashtag.hashtagName}
        </button>
      ))}
    </div>
  );
};
