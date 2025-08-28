'use client';

import css from './write.module.scss';
import { PostForm } from '@/features/post/ui';
import { Trend } from '@/entities/trend/model';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { PostDetail } from '@/entities/post/model';
import { PostAssistant } from '@/entities/trend/ui';
import { queryKey } from '@/app/provider/query/lib';
import { getPostHashtags } from '@/entities/hashtag/api';

interface WriteProps {
  post?: PostDetail;
  trends: Trend[];
  authorId: string;
}

export const Write = ({ post, trends, authorId }: WriteProps) => {
  const searchParams = useSearchParams();
  const showKeywords = searchParams?.get('keyword') === 'true';
  const postId = post?.postId;

  const { data: hashtagsRes } = useQuery({
    queryKey: queryKey().hashtag().postHashtags(Number(postId)),
    queryFn: () => getPostHashtags(Number(postId)),
    enabled: !!postId,
  });

  const hashtags = hashtagsRes?.data?.map(tag => tag.hashtagName) || [];

  return (
    <div className={css.module}>
      <div className={css.editorSection}>
        <PostForm post={post} hashtags={hashtags} authorId={authorId} />
      </div>
      {showKeywords && (
        <div className={css.trendKeywords}>
          <PostAssistant trends={trends} />
        </div>
      )}
    </div>
  );
};

export default Write;
