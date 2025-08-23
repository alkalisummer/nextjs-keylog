'use client';

import { useRef } from 'react';
import css from './postEditor.module.scss';
import { Editor } from '@toast-ui/react-editor';
import { getEditorToolbar } from '@/features/post/lib';
import { ToastEditor } from '@/shared/lib/toastEditor/ToastEditor';

export const PostEditor = () => {
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
          addImageBlobHook: (_imgFile: any, _callBack: any) => {
            //   onUploadImage(imgFile).then(res => {
            //     setImgFileArr((arr: any) => [...arr, res.imgName]);
            //     callBack(res.imgUrl, res.imgName); // 첫번째 인자 : return 받은 이미지 url, 두번째 인자: alt 속성
            //   });
          },
        }}
      />
    </div>
  );
};
