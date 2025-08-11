'use client';

import { useState } from 'react';
import { FieldError } from '@/shared/ui';
import { useForm } from 'react-hook-form';
import { updateProfile } from '../../api';
import css from './profileForm.module.scss';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { initUser } from '@/app/api/auth/[...nextauth]/model/init';
import { ProfileFormSchema, type ProfileForm as Form } from '../../model';

export const ProfileForm = () => {
  const { data: session, update } = useSession();
  const [showNameInput, setShowNameInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id, name, blogName } = session?.user ?? initUser;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(ProfileFormSchema),
    mode: 'onBlur',
    defaultValues: {
      nickname: name,
      blogName: blogName,
    },
  });

  const onSubmit = async (data: Form) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateProfile({
        userId: id,
        nickname: data.nickname,
        blogName: data.blogName,
      });

      if (result.ok) {
        await update({ nickname: data.nickname, blogName: data.blogName });
        setShowNameInput(false);
      }
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={css.module}>
      <div className={css.modalNicknameDiv}>
        {!showNameInput ? (
          <div className={css.contentColumn}>
            <div className={css.headerRow}>
              <span className={css.modalNickname}>{name}</span>
            </div>
            <div>
              <span className={css.modalEmail}>{blogName}</span>
            </div>
            <span
              className={css.modalTextUpdateBtn}
              onClick={() => {
                setShowNameInput(true);
                reset({
                  nickname: name,
                  blogName: blogName,
                });
              }}
            >
              수정
            </span>
          </div>
        ) : (
          <div className={css.contentColumn}>
            <input
              className={css.modalInput}
              autoComplete="off"
              type="text"
              placeholder="닉네임"
              {...register('nickname')}
            />
            <input
              className={css.modalInput}
              autoComplete="off"
              type="text"
              placeholder="블로그 이름"
              {...register('blogName')}
            />
            <FieldError errors={[errors.nickname, errors.blogName]} />
            <div className={css.actionsRow}>
              <button className={css.modalProfileBtn} type="submit">
                저장
              </button>
              <button
                type="button"
                className={`${css.modalProfileBtn} ${css.modalCancel}`}
                onClick={() => setShowNameInput(false)}
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
