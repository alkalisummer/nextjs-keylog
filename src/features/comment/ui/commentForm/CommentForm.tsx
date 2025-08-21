'use client';

import { FormEvent } from 'react';
import { useComment } from '../../hooks';
import { useForm } from 'react-hook-form';
import css from './commentForm.module.scss';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthenticated } from '@/shared/lib/util/auth/client';
import { CreateCommentSchema, CreateCommentForm as Form } from '../../model';

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
  const isAuthenticated = useAuthenticated();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<Form>({
    resolver: zodResolver(CreateCommentSchema),
    mode: 'onBlur',
    defaultValues: {
      postId,
      content: '',
      commentOriginId,
    },
  });

  const { create } = useComment({
    postId,
    onSuccess: () => {
      reset();
      onCancel?.();
    },
  });

  const onSubmit = (data: Form) => {
    create.mutate({
      postId,
      content: data.content,
      commentOriginId,
    });
  };

  const onPreSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      alert('로그인이 필요합니다.\n로그인 페이지로 이동합니다.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    return handleSubmit(onSubmit)(e);
  };

  return (
    <form className={css.module} onSubmit={onPreSubmit}>
      <textarea className={css.textarea} {...register('content')} placeholder={placeholder} maxLength={290} />
      <div className={css.buttonGroup}>
        {onCancel && (
          <button className={css.cancelButton} onClick={onCancel}>
            취소
          </button>
        )}
        <button className={css.submitButton} type="submit" disabled={create.isPending}>
          {create.isPending ? '작성 중...' : buttonText}
        </button>
      </div>
    </form>
  );
};
