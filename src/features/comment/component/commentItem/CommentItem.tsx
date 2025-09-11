'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import css from './commentItem.module.scss';
import { useSession } from 'next-auth/react';
import { formatDate } from '@/shared/lib/util';
import { getCommentToggleLabel } from '../../lib';
import { Comment } from '@/entities/comment/model';
import { useAutoOpenReplies, useComment } from '../../hooks';
import { CommentHeader, CommentEditForm, CommentReplyToggle, CommentReply } from '..';

interface CommentItemProps {
  comment: Comment;
  postId: number;
  authorId: string;
  replies?: Comment[];
  onReplyClick?: () => void;
  showReplyForm?: boolean;
  onReplyCancel?: () => void;
}

export const CommentItem = ({
  comment,
  postId,
  authorId,
  replies = [],
  onReplyClick,
  showReplyForm = false,
  onReplyCancel,
}: CommentItemProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.commentCntn);
  const [showReplies, setShowReplies] = useState(false);

  const { update, delete: deleteComment } = useComment({
    postId,
    authorId,
    onSuccess: () => {
      setIsEditing(false);
    },
  });

  const isAuthor = session?.user?.id === comment.authorId;
  const canShowActions = isAuthor && !isEditing;
  const hasReplies = replies.length > 0;
  const canToggleReplies = comment.commentDepth === 1;
  const showMinusIcon = (showReplies && hasReplies) || showReplyForm;
  const replyToggleLabel = getCommentToggleLabel({
    hasReplies,
    showReplies,
    showReplyForm,
    replyCnt: comment.replyCnt,
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.commentCntn);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent(comment.commentCntn);
  };

  const handleEditSubmit = () => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    update.mutate({
      commentId: comment.commentId,
      content: editContent,
    });
  };

  const handleDelete = () => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      deleteComment.mutate({
        commentId: comment.commentId,
        commentOriginId: comment.commentOriginId || undefined,
      });
    }
  };

  const handleReplyToggle = () => {
    if (hasReplies) {
      setShowReplies(!showReplies);
    } else {
      onReplyClick?.();
    }
  };

  const shouldShowReplyForm = showReplyForm && (showReplies || !hasReplies);

  // 대댓글이 처음 달리면 토글 open
  useAutoOpenReplies(replies.length, showReplies, setShowReplies);

  return (
    <div className={css.module}>
      <CommentHeader
        userImageUrl={comment.userThmbImgUrl}
        userNickname={comment.userNickname}
        date={formatDate({ date: comment.rgsnDttm, seperator: '.', isExtendTime: true })}
        canShowActions={canShowActions}
        onUserClick={() => router.push(`/${comment.authorId}`)}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
      />

      {isEditing ? (
        <CommentEditForm
          value={editContent}
          submitting={update.isPending}
          onChange={setEditContent}
          onCancel={handleEditCancel}
          onSubmit={handleEditSubmit}
        />
      ) : (
        <>
          <p className={css.content}>{comment.commentCntn}</p>
          {canToggleReplies && (
            <CommentReplyToggle isMinus={showMinusIcon} label={replyToggleLabel} onToggle={handleReplyToggle} />
          )}
        </>
      )}

      {canToggleReplies && (
        <CommentReply
          postId={postId}
          authorId={authorId}
          commentId={comment.commentId}
          replies={replies}
          showReplies={showReplies}
          showReplyForm={showReplyForm}
          shouldShowReplyForm={shouldShowReplyForm}
          renderReply={(reply: Comment) => (
            <CommentItem key={reply.commentId} comment={reply} postId={postId} authorId={authorId} />
          )}
          onReplyClick={onReplyClick}
          onReplyCancel={onReplyCancel}
        />
      )}
    </div>
  );
};
