/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

//사용자 세션
import { useSession } from 'next-auth/react';

//Toast UI
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

//이미지 파일 업로드
import { onUploadImage } from '@/utils/CommonUtils';

//시간포맷변경
import { timeToString, timeFormat } from '@/utils/CommonUtils';

//mui notification
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

//hashtag 컴포넌트
import Hashtag from '@/pages/components/Hashtag';

interface hashtag {
  POST_ID: string;
  HASHTAG_ID: string;
  HASHTAG_NAME: string;
}

const ToastEditor = ({ postId, post, tagArr }: { postId: string | undefined; post: any; tagArr: string[] }) => {
  //사용자 세션
  const { data: session, status } = useSession();

  const [title, setTitle] = useState('');
  const editorRef = useRef<Editor>(null);
  //이미지 파일 업로드 변수
  const [imgFileArr, setImgFileArr] = useState<string[]>([]);
  const [oriImgArr, setOriImgArr] = useState<string[]>([]);

  const router = useRouter();
  const { keyword } = router.query;
  const userId = session?.user?.id;

  //html data 추출
  const cheerio = require('cheerio');

  //임시글 여부
  const [tempYn, setTempYn] = useState('N');

  //notification 팝업
  const [showNoti, setShowNoti] = useState(false);

  //hashtag
  const [hashtagArr, setHashtagArr] = useState<string[]>([]);

  useEffect(() => {
    // 수정 화면에서 수정 전 데이터를 세팅
    if (postId) {
      const getPost = async () => {
        setTitle(post.POST_TITLE);
        setHashtagArr(tagArr);

        //html 데이터 추출
        const htmlCntn = Buffer.from(post.POST_HTML_CNTN).toString();
        const $ = cheerio.load(htmlCntn);

        //기존 이미지 파일 이름 추출
        const imageTags = $('img');
        const currImgArr = imageTags.map((index: number, el: any) => $(el).attr('alt')).get();

        //임시글 여부
        if (post.TEMP_YN === 'Y') {
          setTempYn('Y');
        }

        setImgFileArr(currImgArr);
        setOriImgArr(currImgArr);

        editorRef.current?.getInstance().setHTML(htmlCntn);
      };

      const param = {
        type: 'getLastTempPost',
        postId: postId,
      };

      const getTempPost = async () => {
        await axios.get('/api/HandlePost', { params: param }).then(async (res) => {
          if (res.data.items.length > 0) {
            const tmpPost = res.data.items[0];
            if (confirm(`${timeFormat(tmpPost.RGSN_DTTM)} 에 저장된 임시 글이 있습니다. \n 이어서 작성하시겠습니까?`)) {
              setTitle(tmpPost.POST_TITLE);
              debugger;
              setHashtagArr(res.data.hashtagArr.map((hashtag: hashtag) => hashtag.HASHTAG_NAME));

              //html 데이터 추출
              const htmlCntn = Buffer.from(tmpPost.POST_HTML_CNTN).toString();
              const $ = cheerio.load(htmlCntn);

              //기존 이미지 파일 이름 추출
              const imageTags = $('img');
              const currImgArr = imageTags.map((index: number, el: any) => $(el).attr('alt')).get();

              setImgFileArr(currImgArr);
              setOriImgArr(currImgArr);

              editorRef.current?.getInstance().setHTML(htmlCntn);
            } else {
              debugger;
              await getPost();
            }
          } else {
            await getPost();
          }
        });
      };

      getTempPost();
    } else {
      setTitle('');
      editorRef.current?.getInstance().setHTML('');
    }
  }, [postId]);

  const savePost = async (saveType: string) => {
    if (status === 'authenticated') {
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

      //썸네일 이미지 URL 추출(첫번째 이미지)
      const thmbImgUrl = $(imageTags[0])?.attr('src');

      // 지워진 이미지
      let removedImg = [];

      // 현재 이미지에서 지워진 이미지 파일 이름 추출
      for (let originImg of imgFileArr) {
        if (currImageArr.indexOf(originImg) === -1) {
          removedImg.push(originImg);
        }
      }

      if (removedImg.length > 0) {
        await axios.post('/api/DeleteImgFile', { removedImg });
      }

      const currentTime = timeToString(new Date());

      let type = '';
      let saveTempYn = '';
      let postOriginId = ''; // 기존 게시글 수정 중 임시저장했을 경우 원본 게시글 ID
      if (!postId && tempYn === 'N' && saveType === 'publish') {
        // 신규 등록 완료
        type = 'insert';
        saveTempYn = 'N';
      } else if (!postId && tempYn === 'N' && saveType === 'temp') {
        // 신규 등록 중 임시저장한 경우
        type = 'insert';
        saveTempYn = 'Y';
      } else if (postId && tempYn === 'Y' && saveType === 'temp') {
        // 신규등록 중 임시저장했던 글을 다시 임시저장
        type = 'update';
        saveTempYn = 'Y';
      } else if (postId && tempYn === 'Y' && saveType === 'publish') {
        // 신규등록 중 임시저장한 글을 완료
        type = 'update';
        saveTempYn = 'N';
      } else if (postId && tempYn === 'N' && saveType === 'publish') {
        // 기존 게시글 수정 완료
        type = 'update';
        saveTempYn = 'N';
      } else if (postId && tempYn === 'N' && saveType === 'temp') {
        // 기존 게시글 수정중에 임시저장한 경우
        type = 'insert';
        saveTempYn = 'Y';
        postOriginId = postId;
      }

      const postData = {
        type: type,
        post: {
          post_id: postId,
          post_title: title,
          post_cntn: plainText,
          post_html_cntn: htmlCntn,
          post_thmb_img_url: thmbImgUrl ? thmbImgUrl : '',
          rgsr_id: session?.user?.id,
          temp_yn: saveTempYn,
          post_origin_id: postOriginId ? postOriginId : null,
          hashtag_arr: hashtagArr,
          rgsn_dttm: currentTime,
          amnt_dttm: currentTime,
        },
      };
      await axios
        .post('/api/HandlePost', { data: postData })
        .then((response) => response.data)
        .then((res) => {
          if (!postId && type === 'insert' && saveType === 'publish') {
            // 신규등록인 경우
            router.push(`/${userId}/posts/${res.postId}`);
          } else if (!postId && type === 'insert' && saveType === 'temp') {
            // 신규등록중 임시저장을 한 경우
            router.push(`/write?postId=${res.postId}&keyword=true`);
          } else if (postId && type === 'update' && saveType === 'publish' && !postOriginId) {
            // 신규등록중 임시저장한 글을 완료
            const params = { type: 'deleteTempPost', postOriginId: postId };
            axios.post('/api/HandlePost', { data: params }); // 원본 글의 임시저장글은 삭제
            router.push(`/${userId}/posts/${postId}`);
          }
          if (saveType === 'temp') {
            setShowNoti(true);
          }
        });
    } else {
      alert('세션이 만료되어 로그아웃 되었습니다.');
      router.push(`/${userId}`);
    }
  };

  const hadleCancel = async () => {
    if (!postId) {
      // 이미지 제거
      if (imgFileArr.length > 0) {
        const removedImg = imgFileArr;
        await axios.post('/api/DeleteImgFile', { removedImg });
      }
      router.push(`/${userId}`);
    } else {
      // 지워진 이미지
      let removedImg = [];

      // 현재 이미지에서 지워진 이미지 파일 이름 추출
      for (let currImg of imgFileArr) {
        if (oriImgArr.indexOf(currImg) === -1) {
          removedImg.push(currImg);
        }
      }
      if (removedImg.length > 0) {
        await axios.post('/api/DeleteImgFile', { removedImg });
      }
      router.push(`/${userId}/posts/${postId}`);
    }
  };

  const closeNoti = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNoti(false);
  };

  const deleteTag = (index: number) => {
    debugger;
    const removedTagArr = hashtagArr.filter((el, idx) => idx !== index);
    setHashtagArr(removedTagArr);
  };

  return (
    <div className={`${keyword ? '' : 'w70'} post_write_div`}>
      <div className='post_title_created'>
        <input type='text' className='post_title_input' placeholder='제목을 입력하세요' value={title} maxLength={300} onChange={(e) => setTitle(e.target.value)} />
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
        plugins={[colorSyntax]}
        hooks={{
          addImageBlobHook: (imgFile, callBack) => {
            onUploadImage(imgFile).then((res) => {
              setImgFileArr((arr: any) => [...arr, res.imgName]);
              callBack(res.imgUrl, res.imgName); // 첫번째 인자 : return 받은 이미지 url, 두번째 인자: alt 속성
            });
          },
        }}
      />
      <div className='post_hashtag_div'>
        {hashtagArr.length > 0 ? (
          hashtagArr.map((hashtag, idx) => (
            <div className='post_hashtag' key={idx}>
              #{hashtag}
              <span className='post_hashtag_del_btn' onClick={() => deleteTag(idx)}>
                <i className='fa-solid fa-xmark'></i>
              </span>
            </div>
          ))
        ) : (
          <></>
        )}
        <Hashtag hashtagArr={hashtagArr} setHashtagArr={setHashtagArr} />
      </div>
      <div className='post_btn_div'>
        <button className='post_cancel_btn' onClick={hadleCancel} type='button'>
          취소
        </button>
        <div>
          <button className='post_tmp_btn' onClick={() => savePost('temp')}>
            임시저장
          </button>
          <button className='post_submit_btn' onClick={() => savePost('publish')}>
            완료
          </button>
        </div>
      </div>
      <Snackbar
        open={showNoti}
        message='포스트가 임시저장되었습니다.'
        autoHideDuration={3000}
        onClose={closeNoti}
        action={
          <React.Fragment>
            <Button color='primary' size='small' onClick={closeNoti}>
              확인
            </Button>
          </React.Fragment>
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      ></Snackbar>
    </div>
  );
};

export default React.memo(ToastEditor);
