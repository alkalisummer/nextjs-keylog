'use client';

import { useEffect } from 'react';
import { Comment } from '@/entities/comment/model';

interface UseCommentDeepLinkParams {
  currentComment: Comment;
  replies: Comment[];
  showReplies: boolean;
  setShowReplies: (open: boolean) => void;
  targetCommentId?: number | null;
}

export function useCommentDeepLink({
  currentComment,
  replies,
  showReplies,
  setShowReplies,
  targetCommentId,
}: UseCommentDeepLinkParams) {
  useEffect(() => {
    if (!targetCommentId) return;
    const el = document.getElementById(`comment-${targetCommentId}`);

    // 타겟이 현재 댓글이면 스크롤
    if (currentComment.commentId === targetCommentId) {
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 타겟이 대댓글이면 부모를 펼쳐 렌더링되도록 함
    if (!showReplies && replies.some(r => r.commentId === targetCommentId)) {
      setShowReplies(true);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [targetCommentId]);
}
