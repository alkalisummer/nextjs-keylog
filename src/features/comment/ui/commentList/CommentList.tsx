'use client';

import { useState } from 'react';
import css from './commentList.module.scss';
import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/app/provider/query/lib';
import { getCommentList } from '@/entities/comment/api';
import { CommentForm } from '../commentForm/CommentForm';
import { CommentItem } from '../commentItem/CommentItem';

interface CommentListProps {
  postId: number;
}

export const CommentList = ({ postId }: CommentListProps) => {
  const [replyFormCommentId, setReplyFormCommentId] = useState<number | null>(null);

  const { data: commentRes, isLoading } = useQuery({
    queryKey: queryKey().comment().commentList(postId),
    queryFn: () => getCommentList(postId),
  });

  if (isLoading) {
    return <div className={css.loading}>댓글을 불러오는 중...</div>;
  }

  const comments = commentRes?.ok ? commentRes.data.items : [];
  const totalComments = commentRes?.ok ? commentRes.data.totalItems : 0;

  // 부모 댓글과 답글 분리
  const parentComments = comments.filter(comment => comment.commentDepth === 1);
  const repliesMap = comments
    .filter(comment => comment.commentDepth === 2)
    .reduce((acc, reply) => {
      if (!acc[reply.commentOriginId]) {
        acc[reply.commentOriginId] = [];
      }
      acc[reply.commentOriginId].push(reply);
      return acc;
    }, {} as Record<number, typeof comments>);

  const handleReplyClick = (commentId: number) => {
    setReplyFormCommentId(replyFormCommentId === commentId ? null : commentId);
  };

  return (
    <div className={css.commentSection}>
      <div className={css.commentHeader}>
        <span className={css.commentCount}>{totalComments}개의 댓글</span>
      </div>

      <CommentForm postId={postId} />

      <div className={css.commentList}>
        {parentComments.length === 0 ? (
          <div className={css.noComments}>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</div>
        ) : (
          parentComments.map(comment => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              postId={postId}
              replies={repliesMap[comment.commentId] || []}
              onReplyClick={() => handleReplyClick(comment.commentId)}
              showReplyForm={replyFormCommentId === comment.commentId}
              onReplyCancel={() => setReplyFormCommentId(null)}
            />
          ))
        )}
      </div>
    </div>
  );
};
