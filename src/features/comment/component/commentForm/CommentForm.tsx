'use client';

import { useComment } from '../../hooks';
import { useForm } from 'react-hook-form';
import { scroll } from '@/shared/lib/util';
import css from './commentForm.module.scss';
import { useRouter } from 'next/navigation';
import { FieldError } from '@/shared/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthenticated } from '@/shared/lib/util/auth/client';
import { CreateCommentSchema, CreateCommentForm as Form } from '../../model';

interface CommentFormProps {
  postId: number;
  commentOriginId?: number;
  onCancel?: () => void;
  placeholder?: string;
  buttonText?: string;
  showReplies?: boolean;
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(CreateCommentSchema),
    mode: 'onChange',
    defaultValues: {
      postId,
      content: '',
      commentOriginId,
    },
  });

  const { create } = useComment({
    postId,
    onSuccess: () => {
      setValue('content', '');
      onCancel?.();
      if (!commentOriginId) {
        scroll.scrollToBottom({ container: '[data-article-root]' });
      }
    },
  });

  const onSubmit = (data: Form) => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.\n로그인 페이지로 이동합니다.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    create.mutate({
      postId,
      content: data.content,
      commentOriginId,
    });
  };

  return (
    <form className={css.module} onSubmit={handleSubmit(onSubmit)}>
      <textarea className={css.textarea} {...register('content')} placeholder={placeholder} maxLength={290} />
      <FieldError error={errors.content} />
      <div className={css.buttonGroup}>
        {onCancel && (
          <button className={css.cancelButton} type="button" onClick={onCancel}>
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
