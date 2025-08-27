'use client';

import css from './postForm.module.scss';
import { useRouter } from 'next/navigation';
import { useRef, useCallback } from 'react';
import { POST } from '@/shared/lib/constants';
import { removeHtml } from '@/shared/lib/util';
import { usePost } from '@/features/post/hooks';
import { Editor } from '@toast-ui/react-editor';
import { PostDetail } from '@/entities/post/model';
import { uploadPostImage } from '@/features/post/api';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePostImage } from '@/features/post/hooks/usePostImage';
import { ToastEditor } from '@/shared/lib/toastEditor/ToastEditor';
import { PostForm as Form, PostSchema } from '@/features/post/model';
import { getEditorToolbar, extractThumbnail } from '@/features/post/lib';
import { PostHashtag } from '@/features/post/ui/postHashtag/PostHashtag';

interface PostFormProps {
  post?: PostDetail;
  hashtags?: string[];
  authorId: string;
}

export const PostForm = ({ post, authorId }: PostFormProps) => {
  const router = useRouter();
  const editorRef = useRef<Editor>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(PostSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: post?.postTitle ?? '',
      content: post?.postHtmlCntn ?? '',
    },
  });

  const { addUploadedImage, handleCancel, cleanupBeforeSubmit, cleanupAfterUpdateSuccess } = usePostImage({
    initialHtml: post?.postHtmlCntn || '',
  });

  const { createPostMutation, updatePostMutation } = usePost({
    update: { postId: post?.postId || 0, authorId },
  });

  const handleHashtagsChange = useCallback(
    (tags: string[]) => {
      setValue('hashtags', tags, { shouldValidate: true, shouldDirty: true });
    },
    [setValue],
  );

  const onCancel = async () => {
    await handleCancel();
    router.back();
  };

  const onSubmitWith = (tempYn: 'Y' | 'N', postId?: number) =>
    handleSubmit(async (data: Form) => {
      const htmlContent = data.content || '';
      const plainContent = removeHtml(htmlContent);
      const { currentImageNames } = await cleanupBeforeSubmit(htmlContent);

      const postData = {
        postTitle: data.title,
        postCntn: plainContent.substring(0, POST.THUMBNAIL_EXTRACT_LENGTH),
        postHtmlCntn: htmlContent,
        postThmbImgUrl: extractThumbnail(htmlContent) || '',
        tempYn,
        hashtagArr: data.hashtags,
        ...(postId ? { postId } : {}),
      };

      if (postId) {
        try {
          const res = await updatePostMutation.mutateAsync({ ...postData, postId, authorId });
          if (res?.ok ?? true) await cleanupAfterUpdateSuccess(currentImageNames);
        } catch (error) {
          console.error('Failed to update post:', error);
        }
      } else {
        try {
          await createPostMutation.mutateAsync({ ...postData, authorId });
        } catch (error) {
          console.error('Failed to create post:', error);
        }
      }
    });

  return (
    <form className={css.module}>
      <div className={css.header}>
        <input
          type="text"
          className={`${css.postTitle} ${errors.title ? css.error : ''}`}
          placeholder="제목을 입력하세요"
          maxLength={POST.TITLE_MAX_LENGTH}
          {...register('title')}
        />
      </div>
      <div className={css.editorWrapper}>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <ToastEditor
              ref={editorRef}
              height="100%"
              initialEditType="wysiwyg"
              initialValue={typeof field.value === 'string' ? field.value : ''}
              toolbarItems={getEditorToolbar()}
              onChange={() => {
                const html = editorRef.current?.getInstance().getHTML();
                field.onChange(html);
              }}
              hooks={{
                addImageBlobHook: async (imgFile: File, callback: (url: string, altText: string) => void) => {
                  try {
                    const response = await uploadPostImage(imgFile);
                    if (response.ok) {
                      const imageUrl = response.data;
                      const objectName = addUploadedImage(imageUrl);
                      callback(imageUrl, objectName);
                    }
                  } catch (error) {
                    console.error('Image upload failed:', error);
                    alert('이미지 업로드에 실패했습니다.');
                  }
                },
              }}
            />
          )}
        />
      </div>
      <PostHashtag postHashtags={watch('hashtags')} onChange={handleHashtagsChange} />
      <div className={css.buttonWrapper}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          취소
        </button>
        <button className={css.button} type="button" onClick={onSubmitWith('Y')}>
          임시저장
        </button>
        <button className={css.button} type="submit" onClick={onSubmitWith('N', post?.postId)}>
          저장
        </button>
      </div>
    </form>
  );
};
