'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FieldError } from '@/shared/ui';
import css from './imageForm.module.scss';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadUserImage, deleteUserImage } from '../../api';
import { ImageFormSchema, ImageForm as Form } from '../../model';

export const ImageForm = () => {
  const { data: session, update } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const {
    register,
    setError,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(ImageFormSchema),
    mode: 'onChange',
  });

  const onChangeImage = async (data: Form) => {
    if (isUploading) {
      return;
    }

    setIsUploading(true);
    try {
      const userImageUrl = session?.user?.image || '';
      const [_, uploadUserImageRes] = await Promise.all([deleteUserImage(userImageUrl), uploadUserImage(data.image)]);

      if (!uploadUserImageRes?.ok) {
        setError('image', { message: '이미지 업로드에 실패했습니다.' });
        return;
      }

      await update({ type: 'uploadImg', imgUrl: uploadUserImageRes.data });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form className={css.module}>
      <Image
        className={css.profileImg}
        src={avatarError ? '/icon/person.png' : session?.user?.image ? session.user?.image : '/icon/person.png'}
        alt="userImage"
        width={128}
        height={128}
        onError={() => setAvatarError(true)}
      />
      <label htmlFor="fileInput" className={css.imgUploadBtn}>
        이미지 업로드
      </label>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        {...register('image')}
        disabled={isUploading}
        onChange={async e => {
          const file = e.target.files?.[0];
          if (!file) return;
          setValue('image', file);
          const isValid = await trigger('image');
          if (!isValid) {
            return;
          }
          await onChangeImage({ image: file });
        }}
      />
      <button type="button" className={css.imgDelBtn} onClick={() => {}}>
        이미지 삭제
      </button>
      <FieldError error={errors.image} />
    </form>
  );
};
