'use client';

import css from './postAutoPosting.module.scss';
import { useClipboard } from '@/shared/lib/hooks';
import { client } from '@/shared/lib/client/fetch';
import { useEffect, useRef, useState } from 'react';
import { NaverArticle } from '@/entities/trend/model';
import { createAiPostPrompt, readAndRenderStream } from '@/entities/trend/lib';

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

  const createAIPost = async (keyword: string) => {
    if (!keyword || loading) return;
    setLoading(true);
    clear();
    try {
      const naverArticlesRes = await client.route().get<NaverArticle[]>({
        endpoint: '/naverArticles',
        options: {
          searchParams: { keyword },
        },
      });

      if (!naverArticlesRes.ok) {
        throw new Error('Failed to get naver articles');
      }

      const naverArticles = naverArticlesRes.data;

      const res = await client.route().post<ReadableStreamDefaultReader<Uint8Array>>({
        endpoint: '/ai',
        options: {
          headers: { 'Content-Type': 'application/json' },
          body: { messages: createAiPostPrompt({ keyword, naverArticles }) },
          stream: true,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to start stream');
      }

      const reader = res.data;
      await readAndRenderStream(reader, setHtml);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clear();
    setKeyword(selectedKeyword);
  }, [selectedKeyword]);

  return (
    <div className={css.module}>
      <div className={css.controls}>
        <input className={css.input} value={keyword} onChange={e => setKeyword(e.target.value)} />
        <button className={css.button} onClick={() => createAIPost(keyword)} disabled={!keyword || loading}>
          {loading ? '생성 중...' : '글 생성하기'}
        </button>
        <button className={css.button} id="clipboard" data-clipboard-target="#clipboard-content">
          클립보드 복사
        </button>
      </div>
      <div id="clipboard-content" ref={contentRef} className={css.content} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
