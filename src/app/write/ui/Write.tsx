'use client';

import { useRef } from 'react';
import css from './write.module.scss';
import { PostForm } from '@/features/post/ui';
import { TrendKeywordPanel } from '@/entities/trend/ui';
import { Trend } from '@/entities/trend/model';
import { PostDetail } from '@/entities/post/model';
import { useSearchParams } from 'next/navigation';
import { Editor } from '@toast-ui/react-editor';
import { useQuery } from '@tanstack/react-query';
import { getPostHashtags } from '@/entities/hashtag/api';
import { queryKey } from '@/app/provider/query/lib';

interface WriteProps {
  post?: PostDetail;
  trends: Trend[];
  authorId: string;
}

export const Write = ({ post, trends, authorId }: WriteProps) => {
  const searchParams = useSearchParams();
  const showKeywords = searchParams?.get('keyword') === 'true';
  const editorRef = useRef<Editor>(null);
  const postId = post?.postId;

  const { data: hashtagsRes } = useQuery({
    queryKey: queryKey().hashtag().postHashtags(Number(postId)),
    queryFn: () => getPostHashtags(Number(postId)),
    enabled: !!postId,
  });

  const hashtags = hashtagsRes?.data?.map(tag => tag.hashtagName) || [];

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
