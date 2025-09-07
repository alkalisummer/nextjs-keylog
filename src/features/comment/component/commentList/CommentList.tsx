'use client';

import { useState } from 'react';
import css from './commentList.module.scss';
import { CommentForm, CommentItem } from '..';
import { queryKey } from '@/app/provider/query/lib';
import { getCommentList } from '@/entities/comment/api';
import { useSuspenseQuery } from '@tanstack/react-query';
import { mappingReplies, parseParentComments } from '../../lib';

interface CommentListProps {
  postId: number;
}

export const CommentList = ({ postId }: CommentListProps) => {
  const [replyFormCommentId, setReplyFormCommentId] = useState<number | null>(null);

  const { data: commentRes, isLoading } = useSuspenseQuery({
    queryKey: queryKey().comment().commentList(postId),
    queryFn: () => getCommentList(postId),
  });

  if (isLoading) {
    return <div className={css.loading}>댓글을 불러오는 중...</div>;
  }

  if (!commentRes?.ok) {
    throw new Error('Failed to fetch comment list');
  }

  const comments = commentRes.data.items;
  const totalComments = commentRes.data.totalItems;

  // 댓글과 대댓글 분리
  const repliesMap = mappingReplies(comments);
  const commentList = parseParentComments(comments);

  const handleReplyClick = (commentId: number) => {
    setReplyFormCommentId(replyFormCommentId === commentId ? null : commentId);
  };

  return (
    <div className={css.module}>
      <div className={css.commentHeader}>
        <span className={css.commentCount}>{totalComments}개의 댓글</span>
      </div>
      <CommentForm postId={postId} />
      <div className={css.commentList}>
        {commentList.map(comment => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            postId={postId}
            replies={repliesMap[comment.commentId] || []}
            onReplyClick={() => handleReplyClick(comment.commentId)}
            showReplyForm={replyFormCommentId === comment.commentId}
            onReplyCancel={() => setReplyFormCommentId(null)}
          />
        ))}
      </div>
    </div>
  );
};
