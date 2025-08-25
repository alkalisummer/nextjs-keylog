'use client';

import css from './postEditor.module.scss';
import { Editor } from '@toast-ui/react-editor';
import { uploadPostImage } from '@/features/post/api';
import { getEditorToolbar } from '@/features/post/lib';
import { ToastEditor } from '@/shared/lib/toastEditor/ToastEditor';
import { useRef, type Dispatch, type SetStateAction } from 'react';

interface PostEditorProps {
  setImgFiles: Dispatch<SetStateAction<string[]>>;
}

export const PostEditor = ({ setImgFiles }: PostEditorProps) => {
  const editorRef = useRef<Editor>(null);

  return (
    <div className={css.module}>
      <ToastEditor
        ref={editorRef}
        height="86%"
        initialEditType="wysiwyg"
        initialValue="내용을 입력하세요."
        toolbarItems={getEditorToolbar()}
        hooks={{
          addImageBlobHook: (imgFile: any, callBack: any) => {
            uploadPostImage(imgFile).then(res => {
              const imageUrl = res.data;
              setImgFiles((prev: string[]) => [...prev, imageUrl]);
              callBack(imageUrl, imgFile.name);
            });
          },
        }}
      />
    </div>
  );
};
