'use client';

import css from './postAutoPosting.module.scss';
import { useClipboard } from '@/shared/hooks';
import { useEffect, useRef, useState } from 'react';
import { createAIPost } from '@/entities/trend/lib';
import { sanitizeHtml } from '@/shared/lib/dompurify/sanitize';

interface PostAutoPostingProps {
  selectedKeyword?: string;
}
export function PostAutoPosting({ selectedKeyword = '' }: PostAutoPostingProps) {
  const [keyword, setKeyword] = useState(selectedKeyword);
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState('');
  const contentRef = useRef<HTMLDivElement | null>(null);

  useClipboard({ elementId: 'clipboard' });

  const clear = () => {
    setHtml('');
  };

  const handleCreateClick = async (keyword: string) => {
    await createAIPost({ keyword, setHtml, setLoading, clear, isLoading: loading });
  };

  useEffect(() => {
    clear();
    setKeyword(selectedKeyword);
  }, [selectedKeyword]);

  return (
    <div className={css.module}>
      <div className={css.controls}>
        <input className={css.input} value={keyword} onChange={e => setKeyword(e.target.value)} />
        <button className={css.button} onClick={() => handleCreateClick(keyword)} disabled={!keyword || loading}>
          {loading ? '생성 중...' : '글 생성하기'}
        </button>
        <button className={css.button} id="clipboard" data-clipboard-target="#clipboard-content">
          클립보드 복사
        </button>
      </div>
      <div
        id="clipboard-content"
        ref={contentRef}
        className={css.content}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
      />
    </div>
  );
}
