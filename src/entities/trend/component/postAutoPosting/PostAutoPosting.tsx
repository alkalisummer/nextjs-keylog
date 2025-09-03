'use client';

import { useEffect, useRef, useState } from 'react';
import css from './postAutoPosting.module.scss';
import ArticlePrompt from '@/utils/ChatGptPrompt';
import ChatGptHandle from '@/utils/ChatGptHandle';

interface PostAutoPostingProps {
  defaultKeyword?: string;
}

interface Message {
  role: string;
  content: string;
}

export function PostAutoPosting({ defaultKeyword = '' }: PostAutoPostingProps) {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.innerHTML = '';
  }, [keyword]);

  const clear = () => {
    if (contentRef.current) contentRef.current.innerHTML = '';
  };

  const generate = async () => {
    if (!keyword || loading) return;
    setLoading(true);
    clear();
    const chatMsg = (await ArticlePrompt(keyword)) as Message;
    if (!chatMsg || Object.keys(chatMsg).length === 0) {
      setLoading(false);
      return;
    }
    const stream = await ChatGptHandle('auto-post', chatMsg);
    let html = '';
    for await (const chunk of stream) {
      if (chunk.choices[0].finish_reason) {
        setLoading(false);
      }
      const text = chunk.choices[0].delta.content;
      if (text) {
        html += text;
        if (contentRef.current) contentRef.current.innerHTML = html.replaceAll('```html', '').replaceAll('```', '');
      }
    }
  };

  return (
    <div className={css.module}>
      <div className={css.controls}>
        <label className={css.label}>키워드:</label>
        <input className={css.input} value={keyword} onChange={e => setKeyword(e.target.value)} />
        <button className={css.button} onClick={generate} disabled={!keyword || loading}>
          {loading ? '생성 중...' : '글 생성하기'}
        </button>
        <button className={css.button} onClick={clear}>
          초기화
        </button>
        <button
          className={css.button}
          onClick={() => contentRef.current && navigator.clipboard.writeText(contentRef.current.innerHTML)}
        >
          클립보드 복사
        </button>
      </div>
      <div ref={contentRef} className={css.content} />
    </div>
  );
}
