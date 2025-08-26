'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import css from './postForm.module.scss';
import { Editor } from '@toast-ui/react-editor';
import { uploadPostImage } from '@/features/post/api';
import { getEditorToolbar } from '@/features/post/lib';
import { ToastEditor } from '@/shared/lib/toastEditor/ToastEditor';
import { usePost } from '@/features/post/hooks';
import { removeHtml } from '@/utils/CommonUtils';
import { PostDetail } from '@/entities/post/model';
import { useRouter } from 'next/navigation';
import { PostHashtag } from '@/features/post/ui/postHashtag/PostHashtag';
import { POST } from '@/shared/lib/constants';

interface WriteContainerProps {
  post?: PostDetail;
  hashtags?: string[];
  authorId: string;
}

export const PostForm = ({ post, hashtags = [], authorId }: WriteContainerProps) => {
  const router = useRouter();
  const editorRef = useRef<Editor>(null);

  const [title, setTitle] = useState(post?.postTitle || '');

  const [imgFiles, setImgFiles] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(hashtags);

  const { createPostMutation, updatePostMutation } = usePost({
    update: { postId: post?.postId || 0, authorId },
  });

  const isEditMode = !!post;
  const isLoading = createPostMutation.isPending || updatePostMutation.isPending;

  useEffect(() => {
    if (post && editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setHTML(post.postHtmlCntn);
    }
  }, [post]);

  const handleHashtagsChange = useCallback((tags: string[]) => {
    setSelectedHashtags(tags);
  }, []);

  const extractThumbnail = (htmlContent: string): string => {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = htmlContent.match(imgRegex);
    return match ? match[1] : '';
  };

  const handleSubmit = async (tempYn: 'Y' | 'N', postId?: number) => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const editorInstance = editorRef.current?.getInstance();
    if (!editorInstance) return;

    const htmlContent = editorInstance.getHTML();

    const plainContent = removeHtml(htmlContent);

    const postData = {
      postTitle: title,
      postCntn: plainContent.substring(0, POST.THUMBNAIL_EXTRACT_LENGTH),
      postHtmlCntn: htmlContent,
      postThmbImgUrl: extractThumbnail(htmlContent) || imgFiles[0] || '',
      tempYn,
      hashtagArr: selectedHashtags,
      ...(!isEditMode && postId ? { postOriginId: postId } : {}),
    };

    if (isEditMode) {
      updatePostMutation.mutate(postData);
    } else {
      createPostMutation.mutate(postData);
    }
  };

  return (
    <div className={css.module}>
      <div className={css.header}>
        <input
          type="text"
          className={css.postTitle}
          placeholder="제목을 입력하세요"
          value={title}
          maxLength={POST.TITLE_MAX_LENGTH}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div className={css.editorWrapper}>
        <ToastEditor
          ref={editorRef}
          height="100%"
          initialEditType="wysiwyg"
          initialValue={post ? '' : '내용을 입력하세요.'}
          toolbarItems={getEditorToolbar()}
          hooks={{
            addImageBlobHook: async (imgFile: File, callback: (url: string, altText: string) => void) => {
              try {
                const response = await uploadPostImage(imgFile);
                if (response.ok) {
                  const imageUrl = response.data;
                  setImgFiles(prev => [...prev, imageUrl]);
                  callback(imageUrl, imgFile.name);
                }
              } catch (error) {
                console.error('Image upload failed:', error);
                alert('이미지 업로드에 실패했습니다.');
              }
            },
          }}
        />
      </div>
      <PostHashtag postHashtags={selectedHashtags} onChange={handleHashtagsChange} />
      <div className={css.buttonWrapper}>
        <button className={css.cancelButton} onClick={() => router.back()}>
          취소
        </button>
        <button className={css.button} onClick={() => handleSubmit('Y')}>
          임시저장
        </button>
        <button className={css.button} onClick={() => handleSubmit('N')}>
          저장
        </button>
      </div>
    </div>
  );
};
