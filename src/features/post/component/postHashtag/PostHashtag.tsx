'use client';

import React from 'react';
import { useState } from 'react';
import css from './postHashtag.module.scss';
import { sanitizeHashtag } from '@/features/post/lib';

interface Props {
  postHashtags?: string[];
  onChange?: (hashtags: string[]) => void;
}

export function PostHashtag({ postHashtags = [], onChange }: Props) {
  const [newHashtag, setNewHashtag] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleHashtagAdd = () => {
    const sanitized = sanitizeHashtag(newHashtag);
    if (sanitized && !postHashtags.includes(sanitized)) {
      const next = [...postHashtags, sanitized];
      onChange?.(next);
      setNewHashtag('');
    }
  };

  const handleHashtagRemove = (tag: string) => {
    const next = postHashtags.filter(t => t !== tag);
    onChange?.(next);
  };

  return (
    <div className={css.module}>
      <div className={css.hashtagList}>
        {postHashtags.map(tag => (
          <span key={tag} className={css.hashtagChip} onClick={() => handleHashtagRemove(tag)}>
            #{tag}
          </span>
        ))}
        <input
          type="text"
          placeholder="#해시태그를 입력하세요 (엔터로 추가)"
          value={newHashtag}
          onChange={e => setNewHashtag(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={e => {
            if (isComposing) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleHashtagAdd();
            }
          }}
        />
      </div>
    </div>
  );
}
export default React.memo(PostHashtag);
