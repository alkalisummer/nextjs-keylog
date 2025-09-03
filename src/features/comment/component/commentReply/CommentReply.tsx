'use client';

import { CommentForm } from '..';
import css from './commentReply.module.scss';
import { Comment } from '@/entities/comment/model';

type ReplySectionProps = {
  postId: number;
  commentId: number;
  replies: Comment[];
  showReplies: boolean;
  showReplyForm: boolean;
  shouldShowReplyForm: boolean;
  renderReply: (reply: Comment) => React.ReactNode;
  onReplyClick?: () => void;
  onReplyCancel?: () => void;
};

export function CommentReply({
  postId,
  commentId,
  replies,
  showReplies,
  showReplyForm,
  shouldShowReplyForm,
  renderReply,
  onReplyClick,
  onReplyCancel,
}: ReplySectionProps) {
  const hasReplies = replies.length > 0;

  return (
    <>
      {showReplies && hasReplies && (
        <div className={css.module}>
          {replies.map(reply => renderReply(reply))}
          {!showReplyForm && (
            <div className={css.replyFooter}>
              <button className={css.replyButton} onClick={() => onReplyClick?.()}>
                답글달기
              </button>
            </div>
          )}
        </div>
      )}

      {shouldShowReplyForm && (
        <div className={css.replyFormContainer}>
          <CommentForm
            postId={postId}
            commentOriginId={commentId}
            onCancel={onReplyCancel}
            placeholder="답글을 작성하세요."
            buttonText="답글 작성"
          />
        </div>
      )}
    </>
  );
}
