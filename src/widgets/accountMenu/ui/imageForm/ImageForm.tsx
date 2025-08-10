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
    const isValid = await trigger('image');

    if (!isValid) {
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

  const deleteImage = async () => {
    const userImageUrl = session?.user?.image || '';
    if (!userImageUrl) {
      return;
    }
    await deleteUserImage(userImageUrl);
    await update({ type: 'deleteImg' });
  };

  return (
    <form className={css.module}>
      <Image
        className={css.profileImg}
        src={session?.user?.image ? session.user.image : '/icon/person.png'}
        alt="userImage"
        width={128}
        height={128}
        onError={e => (e.currentTarget.src = '/icon/person.png')}
      />
      <label htmlFor="fileInput" className={css.imgUploadBtn}>
        이미지 업로드
      </label>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        {...register('image', {
          onChange: async e => {
            const file = e.target.files?.[0];
            setValue('image', file);
            await onChangeImage({ image: file });
          },
        })}
        disabled={isUploading}
      />
      <button type="button" className={css.imgDelBtn} onClick={deleteImage}>
        이미지 삭제
      </button>
      <FieldError error={errors.image} />
    </form>
  );
};
