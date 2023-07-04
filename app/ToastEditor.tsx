'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/Post.css';
import axios from 'axios';

//Toast UI
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

//이미지 파일 업로드
import { onUploadImage } from '@/app/utils/CommonUtils';

//시간포맷변경
import timeToString from '@/app/utils/CommonUtils';

const ToastEditor = ({ mode, postId }: { mode: string; postId: string | null }) => {
  const [title, setTitle] = useState('');
  const editorRef = useRef<Editor>(null);

  //이미지 파일 업로드 변수
  const [imgFileArr, setImgFileArr] = useState<string[]>([]);
  const [oriImgArr, setOriImgArr] = useState<string[]>([]);

  const router = useRouter();

  //html data 추출
  const cheerio = require('cheerio');

  useEffect(() => {
    // 수정 화면에서 수정 전 데이터를 세팅
    if (mode === 'update') {
      const param = {
        type: '',
        postId: postId,
      };

      const getPost = async () => {
        param.type = 'read';
        await axios.get('/api/HandlePost', { params: param }).then((res) => {
          setTitle(res.data.items[0].post_title);

          //html 데이터 추출
          const htmlCntn = Buffer.from(res.data.items[0].post_html_cntn).toString();
          const $ = cheerio.load(htmlCntn);

          //기존 이미지 파일 이름 추출
          const imageTags = $('img');
          const currImgArr = imageTags.map((index: number, el: any) => $(el).attr('alt')).get();

          setImgFileArr(currImgArr);
          setOriImgArr(currImgArr);

          editorRef.current?.getInstance().setHTML(htmlCntn);
        });
      };
      getPost();
    }
  }, [mode, postId, cheerio]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //html 추출 및 제거
    const htmlCntn = editorRef.current?.getInstance().getHTML();
    const $ = cheerio.load(htmlCntn);
    const plainText = $.text();

    if (title.replaceAll(' ', '').length === 0) {
      alert('제목을 입력하세요.');
      return;
    } else if (plainText.replaceAll(' ', '').length === 0) {
      alert('내용을 입력하세요.');
      return;
    }

    //현재 이미지 파일 이름 추출
    const imageTags = $('img');
    const currImageArr = imageTags.map((index: number, el: any) => $(el).attr('alt')).get();
    // 지워진 이미지
    let removedImg = [];

    // 현재 이미지에서 지워진 이미지 파일 이름 추출
    for (let originImg of imgFileArr) {
      if (currImageArr.indexOf(originImg) === -1) {
        removedImg.push(originImg);
      }
    }

    axios.post('/api/DeleteImgFile', { removedImg });

    const currentTime = timeToString(new Date());

    const postData = {
      type: mode,
      post: {
        post_id: postId,
        post_title: title,
        post_cntn: plainText,
        post_html_cntn: htmlCntn,
        rgsn_dttm: currentTime,
        amnt_dttm: currentTime,
      },
    };
    await axios
      .post('/api/HandlePost', { postData })
      .then((response) => response.data)
      .then(function (res) {
        setTitle('');
        router.refresh();
        if (mode === 'insert') {
          router.push(`/posts/detail/${res.postId}`);
        } else {
          router.push(`/posts/detail/${postId}`);
        }
      });
  };

  const hadleCancel = async () => {
    if (mode === 'insert') {
      // 이미지 제거
      if (imgFileArr.length > 0) {
        const removedImg = imgFileArr;
        await axios.post('/api/DeleteImgFile', { removedImg });
      }

      router.push(`/`);
    } else {
      // 지워진 이미지
      let removedImg = [];

      // 현재 이미지에서 지워진 이미지 파일 이름 추출
      for (let currImg of imgFileArr) {
        if (oriImgArr.indexOf(currImg) === -1) {
          removedImg.push(currImg);
        }
      }

      await axios.post('/api/DeleteImgFile', { removedImg });
      router.push(`/posts/detail/${postId}`);
    }
  };

  return (
    <form
      className='post_div'
      onSubmit={handleSubmit}>
      <div className='post_title_created'>
        <input
          type='text'
          className='post_title_input'
          placeholder='제목을 입력하세요'
          value={title}
          maxLength={300}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <Editor
        ref={editorRef}
        height='86%'
        initialEditType='wysiwyg'
        initialValue='내용을 입력하세요.'
        toolbarItems={[
          ['bold', 'italic', 'strike', 'hr'],
          ['image', 'table'],
          ['ul', 'ol', 'task'],
          ['code', 'codeblock'],
        ]}
        hooks={{
          addImageBlobHook: (imgFile, callBack) => {
            onUploadImage(imgFile).then((res) => {
              setImgFileArr((arr: any) => [...arr, res.imgName]);
              callBack(res.imgUrl, res.imgName); // 첫번째 인자 : return 받은 이미지 url, 두번째 인자: alt 속성
            });
          },
        }}
      />
      <div className='post_btn_div'>
        <button
          className='post_cancel_btn'
          onClick={hadleCancel}
          type='button'>
          취소
        </button>
        <button
          className='post_submit_btn'
          type='submit'>
          완료
        </button>
      </div>
    </form>
  );
};

export default ToastEditor;
