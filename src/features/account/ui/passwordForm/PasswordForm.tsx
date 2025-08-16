'use client';

import { useState } from 'react';
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
    // formState: { errors },
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
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={css.module}>
      <div className={css.subTitle}>
        <span>비밀번호</span>
      </div>
      <div className={css.sub}>
        {!showPwInput ? (
          <button className={css.passwordBtn} onClick={() => setShowPwInput(true)}>
            비밀번호 변경
          </button>
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
            <div className={css.button}>
              <button className={css.passwordBtn} type="submit">
                확인
              </button>
              <button className={css.passwordBtn} onClick={() => setShowPwInput(false)}>
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
