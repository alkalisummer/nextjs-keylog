'use client';

import { useState } from 'react';
import { useComment } from '../../hooks';
import { useRouter } from 'next/navigation';
import css from './commentItem.module.scss';
import { useSession } from 'next-auth/react';
import { timeFormat } from '@/utils/CommonUtils';
import { Comment } from '@/entities/comment/model';
import { CommentForm } from '../commentForm/CommentForm';

interface CommentItemProps {
  comment: Comment;
  postId: number;
  replies?: Comment[];
  onReplyClick?: () => void;
  showReplyForm?: boolean;
  onReplyCancel?: () => void;
}

export const CommentItem = ({
  comment,
  postId,
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
    onSuccess: () => {
      setIsEditing(false);
    },
  });

  const isAuthor = session?.user?.id === comment.authorId;
  const hasReplies = replies.length > 0;

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

  return (
    <div className={css.commentItem}>
      <div className={css.header}>
        <div className={css.userInfo}>
          <img
            className={css.userImage}
            src={comment.userThmbImgUrl || '/icon/person.png'}
            alt={`${comment.userNickname} profile`}
          />
          <div className={css.userDetails}>
            <span className={css.userName} onClick={() => router.push(`/${comment.authorId}`)}>
              {comment.userNickname}
            </span>
            <span className={css.date}>{timeFormat(comment.rgsnDttm)}</span>
          </div>
        </div>
        {isAuthor && !isEditing && (
          <div className={css.actions}>
            <span className={css.actionText} onClick={handleEdit}>
              수정
            </span>
            <span className={css.actionText} onClick={handleDelete}>
              삭제
            </span>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className={css.editForm}>
          <textarea
            className={css.editTextarea}
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            maxLength={290}
          />
          <div className={css.editButtons}>
            <button className={css.cancelButton} onClick={handleEditCancel}>
              취소
            </button>
            <button className={css.submitButton} onClick={handleEditSubmit} disabled={update.isPending}>
              {update.isPending ? '수정 중...' : '댓글 수정'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className={css.content}>{comment.commentCntn}</p>
          {comment.commentDepth === 1 && (
            <span className={css.replyToggle} onClick={handleReplyToggle}>
              <i className="fa-regular fa-square-plus"></i>&nbsp;&nbsp;
              {hasReplies ? `${comment.replyCnt}개의 답글` : '답글 달기'}
            </span>
          )}
        </>
      )}

      {showReplies && hasReplies && (
        <div className={css.repliesContainer}>
          {replies.map(reply => (
            <CommentItem key={reply.commentId} comment={reply} postId={postId} />
          ))}
        </div>
      )}

      {showReplyForm && (
        <div className={css.replyFormContainer}>
          <CommentForm
            postId={postId}
            commentOriginId={comment.commentId}
            onCancel={onReplyCancel}
            placeholder="답글을 작성하세요."
            buttonText="답글 작성"
          />
        </div>
      )}
    </div>
  );
};
