'use client';

import { useState } from 'react';
import { updateEmail } from '../../api';
import { FieldError } from '@/shared/ui';
import css from './emailForm.module.scss';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { initUser } from '@/app/api/auth/[...nextauth]/model/init';
import { EmailFormSchema, type EmailForm as Form } from '../../model';

export const EmailForm = () => {
  const { data: session, update } = useSession();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { email } = session?.user ?? initUser;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(EmailFormSchema),
    mode: 'onBlur',
    defaultValues: {
      email: email,
    },
  });

  const onSubmit = async (data: Form) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await Promise.all([updateEmail({ email: data.email }), update({ email: data.email })]);
      setShowEmailInput(false);
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
        <span>이메일</span>
      </div>
      <div className={css.sub}>
        {!showEmailInput ? (
          <>
            <span className={css.email}>{email}</span>
            <span
              className={css.updateBtn}
              onClick={() => {
                setShowEmailInput(true);
                reset({
                  email: email,
                });
              }}
            >
              수정
            </span>
          </>
        ) : (
          <>
            <input
              type="email"
              autoComplete="off"
              placeholder="이메일을 입력하세요."
              className={css.input}
              {...register('email')}
            />
            <FieldError error={errors.email} />
            <button className={css.profileBtn} type="submit">
              저장
            </button>
          </>
        )}
      </div>
    </form>
  );
};
