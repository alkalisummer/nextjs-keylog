'use client';

import { useState } from 'react';
import { FieldError } from '@/shared/ui';
import { useForm } from 'react-hook-form';
import { updatePassword } from '../../api';
import css from './passwordForm.module.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckPasswordFormSchema, type CheckPasswordForm as Form } from '../../model';

export const PasswordForm = () => {
  const [showPwInput, setShowPwInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(CheckPasswordFormSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: Form) => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      await updatePassword({ newPassword: data.newPassword });
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setShowPwInput(false);
      alert('비밀번호가 변경되었습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={css.module}>
      <div className={css.subTitle}>
        <span>비밀번호</span>
      </div>
      <div className={css.sub}>
        {!showPwInput ? (
          <span className={css.passwordBtn} onClick={() => setShowPwInput(true)}>
            비밀번호 변경
          </span>
        ) : (
          <div className={css.updatePassword}>
            <input type="password" placeholder="현재 비밀번호" className={css.pwInput} {...register('currPassword')} />
            <input type="password" placeholder="새 비밀번호" className={css.pwInput} {...register('newPassword')} />
            <input
              type="password"
              placeholder="새 비밀번호 확인"
              className={css.pwInput}
              {...register('checkPassword')}
            />
            <FieldError errors={[errors.currPassword, errors.newPassword, errors.checkPassword]} />
            <div className={css.button}>
              <button type="submit">확인</button>
              <button onClick={() => setShowPwInput(false)}>취소</button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
