'use client';

import { useRef } from 'react';
import css from './write.module.scss';
import { PostForm } from '@/features/post/ui';
import { TrendKeywordPanel } from '@/entities/trend/ui';
import { Trend } from '@/entities/trend/model';
import { PostDetail } from '@/entities/post/model';
import { useSearchParams } from 'next/navigation';
import { Editor } from '@toast-ui/react-editor';

interface WriteProps {
  post?: PostDetail;
  hashtags?: string[];
  trends: Trend[];
  authorId: string;
}

export const Write = ({ post, hashtags, trends, authorId }: WriteProps) => {
  const searchParams = useSearchParams();
  const showKeywords = searchParams?.get('keyword') === 'true';
  const editorRef = useRef<Editor>(null);

  const handleKeywordInsert = (keyword: string) => {
    const editor = editorRef.current?.getInstance();
    if (editor) {
      const currentContent = editor.getMarkdown();
      editor.setMarkdown(currentContent + `\n\n#${keyword}`);
    }
  };

  return (
    <div className={css.module}>
      <div className={css.editorSection}>
        <PostForm post={post} hashtags={hashtags} authorId={authorId} />
      </div>
      {showKeywords && (
        <div className={css.trendKeywords}>
          <TrendKeywordPanel trends={trends} onKeywordClick={handleKeywordInsert} />
        </div>
      )}
    </div>
  );
};

export default Write;
