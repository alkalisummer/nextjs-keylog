'use client';

import { useState } from 'react';
import { useComment } from '../../hooks';
import css from './commentForm.module.scss';
import { useSession } from 'next-auth/react';

interface CommentFormProps {
  postId: number;
  commentOriginId?: number;
  onCancel?: () => void;
  placeholder?: string;
  buttonText?: string;
}

export const CommentForm = ({
  postId,
  commentOriginId,
  onCancel,
  placeholder = '댓글을 작성하세요.',
  buttonText = '댓글 작성',
}: CommentFormProps) => {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const { create } = useComment({
    postId,
    onSuccess: () => {
      setContent('');
      onCancel?.();
    },
  });

  const handleSubmit = () => {
    if (!session?.user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!content.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    create.mutate({
      postId,
      content,
      commentOriginId,
    });
  };

  return (
    <div className={css.commentForm}>
      <textarea
        className={css.textarea}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={placeholder}
        maxLength={290}
      />
      <div className={css.buttonGroup}>
        {onCancel && (
          <button className={css.cancelButton} onClick={onCancel}>
            취소
          </button>
        )}
        <button className={css.submitButton} onClick={handleSubmit} disabled={create.isPending}>
          {create.isPending ? '작성 중...' : buttonText}
        </button>
      </div>
    </div>
  );
};
