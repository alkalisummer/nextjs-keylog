'use client';

import { useState } from 'react';
import css from './commentList.module.scss';
import { CommentForm, CommentItem } from '..';
import { useSearchParams } from 'next/navigation';
import { queryKey } from '@/app/provider/query/lib';
import { getCommentList } from '@/entities/comment/api';
import { useSuspenseQuery } from '@tanstack/react-query';
import { mappingReplies, parseParentComments } from '../../lib';

interface CommentListProps {
  postId: number;
  authorId: string;
}

export const CommentList = ({ postId, authorId }: CommentListProps) => {
  const searchParams = useSearchParams();
  const commentId = searchParams.get('commentId');
  const targetCommentId = commentId ? Number(commentId) : null;
  const [replyFormCommentId, setReplyFormCommentId] = useState<number | null>(null);

  const { data: commentRes, isError } = useSuspenseQuery({
    queryKey: queryKey().comment().commentList(postId),
    queryFn: () => getCommentList(postId),
  });

  if (isError) {
    throw new Error('Failed to fetch comment list');
  }

  const comments = commentRes?.data?.items;
  const totalComments = commentRes?.data?.totalItems;

  // 댓글과 대댓글 분리
  const repliesMap = mappingReplies(comments || []);
  const commentList = parseParentComments(comments || []);

  const handleReplyClick = (commentId: number) => {
    setReplyFormCommentId(replyFormCommentId === commentId ? null : commentId);
  };

  return (
    <div className={css.module}>
      <div className={css.commentHeader}>
        <span className={css.commentCount}>{totalComments}개의 댓글</span>
      </div>
      <CommentForm postId={postId} authorId={authorId} />
      <div className={css.commentList}>
        {commentList.map(comment => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            postId={postId}
            authorId={authorId}
            replies={repliesMap[comment.commentId] || []}
            onReplyClick={() => handleReplyClick(comment.commentId)}
            showReplyForm={replyFormCommentId === comment.commentId}
            onReplyCancel={() => setReplyFormCommentId(null)}
            targetCommentId={targetCommentId}
          />
        ))}
      </div>
    </div>
  );
};
