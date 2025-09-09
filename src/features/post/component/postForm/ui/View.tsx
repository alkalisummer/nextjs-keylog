'use client';

import css from './view.module.scss';
import { useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { POST } from '@/shared/lib/constants';
import { useCheckAuth } from '@/shared/hooks';
import { removeHtml } from '@/shared/lib/util';
import { usePost } from '@/features/post/hooks';
import { Editor } from '@toast-ui/react-editor';
import { PostDetail } from '@/entities/post/model';
import { uploadPostImage } from '@/features/post/api';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostHashtag } from '@/features/post/component';
import { sanitizeHtml } from '@/shared/lib/dompurify/sanitize';
import { usePostImage } from '@/features/post/hooks/usePostImage';
import { ToastEditor } from '@/shared/lib/toastEditor/ToastEditor';
import { PostForm as Form, PostSchema } from '@/features/post/model';
import { getEditorToolbar, extractThumbnail } from '@/features/post/lib';

interface Props {
  post?: PostDetail;
  hashtags?: string[];
  authorId: string;
}

export const View = ({ post, hashtags, authorId }: Props) => {
  const router = useRouter();
  const editorRef = useRef<Editor>(null);
  const isAuthorized = useCheckAuth(authorId);

  // 게시물 작성, 수정 custom hooks
  const { createPostMutation, updatePostMutation } = usePost({
    update: { postId: post?.postId || 0, authorId },
  });
  const { addUploadedImage, handleCancel, cleanupBeforeSubmit, cleanupAfterUpdateSuccess } = usePostImage({
    initialHtml: post?.postHtmlCntn || '',
  });

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
      hashtags: hashtags || [],
    },
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
      if (!isAuthorized) {
        alert('비정상적인 접근입니다. 로그인 화면으로 이동합니다.');
        router.push('/login');
        return;
      }

      // sanitize user-provided HTML before any further processing
      const htmlContent = sanitizeHtml(data.content || '');
      const plainContent = removeHtml(htmlContent);
      const { currentImageNames } = await cleanupBeforeSubmit(htmlContent);

      const postData = {
        postTitle: data.title,
        postCntn: plainContent.substring(0, POST.THUMBNAIL_EXTRACT_LENGTH),
        postHtmlCntn: htmlContent,
        postThmbImgUrl: extractThumbnail(htmlContent) || '',
        tempYn,
        ...(data.hashtags ? { hashtagList: data.hashtags } : {}),
        ...(postId ? { postId } : {}),
      };

      if (postId) {
        // 게시물 수정
        try {
          const res = await updatePostMutation.mutateAsync({ ...postData, postId, authorId });
          if (res?.ok ?? true) await cleanupAfterUpdateSuccess(currentImageNames);
        } catch (error) {
          console.error('Failed to update post:', error);
        }
      } else {
        // 게시물 신규등록
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
                    debugger;
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
        <button className={css.button} type="button" onClick={onSubmitWith('Y', post?.postId)}>
          임시저장
        </button>
        <button className={css.button} type="submit" onClick={onSubmitWith('N', post?.postId)}>
          저장
        </button>
      </div>
    </form>
  );
};
