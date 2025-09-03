'use client';

import css from './commentEditForm.module.scss';

type CommentEditFormProps = {
  value: string;
  submitting: boolean;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export function CommentEditForm({ value, submitting, onChange, onCancel, onSubmit }: CommentEditFormProps) {
  return (
    <div className={css.module}>
      <textarea
        placeholder="댓글을 작성하세요."
        className={css.editTextarea}
        value={value}
        onChange={e => onChange(e.target.value)}
        maxLength={290}
      />
      <div className={css.editButtons}>
        <button className={css.cancelButton} onClick={onCancel}>
          취소
        </button>
        <button className={css.submitButton} onClick={onSubmit} disabled={submitting}>
          {submitting ? '수정 중...' : '댓글 수정'}
        </button>
      </div>
    </div>
  );
}
