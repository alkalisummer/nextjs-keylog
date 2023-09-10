import '@toast-ui/editor/dist/toastui-editor.css';
import BlogLayout from '../../blogLayout';
import Link from 'next/link';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { timeFormat } from '@/utils/CommonUtils';
import PostLayout from '../postLayout';
import { GetServerSideProps } from 'next';
import { handleMySql } from '@/pages/api/HandlePost';
import CheckAuth from '@/utils/CheckAuth';
import ClipboardJS from 'clipboard';

//mui notification
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

interface post {
  POST_ID: string;
  POST_TITLE: string;
  AMNT_DTTM: string;
}

interface user {
  id: string;
  email: string;
  image: string;
  nickname: string;
}

const PostDetailPage = ({ post, imgFileArr, htmlCntn, userInfo }: { post: post; imgFileArr: []; htmlCntn: string; userInfo: user }) => {
  const router = useRouter();
  const { userId } = router.query;
  const [currUrl, setCurrUrl] = useState('');
  const [showNoti, setShowNoti] = useState(false);

  useEffect(() => {
    setCurrUrl(window.location.href);
  }, []);

  const handleDelete = async () => {
    const param = { type: 'delete', postId: post.POST_ID };
    await axios.get('/api/HandlePost', { params: param }).then(() => {
      // 해당 게시글 이미지 삭제
      let removedImg = imgFileArr;
      axios.post('/api/DeleteImgFile', { removedImg });
      router.push('/');
    });
  };

  //sns 공유, url 클립보드 복사
  const scrapPost = (type: string) => {
    switch (type) {
      case 'facebook':
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank', 'width=600,height=400');
        break;
      case 'twitter':
        window.open(
          'http://twitter.com/share?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent(post.POST_TITLE),
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'cilpboard':
        const clipboard = new ClipboardJS('#post_url_copy');
        const urlInput = document.getElementById('currentUrl');
        urlInput!.style.display = 'initial';

        clipboard.on('success', function (e) {
          urlInput!.style.display = 'none';
          e.clearSelection();
        });

        setShowNoti(true);
        break;
    }
  };

  const closeNoti = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNoti(false);
  };
  return (
    <BlogLayout userInfo={userInfo}>
      <PostLayout>
        <div className='post_div'>
          <div className='post_title_created'>
            <span className='post_title'>{post.POST_TITLE}</span>
            <div className='post_created'>
              <span className='mg-r-10 pointer'>{timeFormat(post.AMNT_DTTM)}</span>
              {CheckAuth() ? (
                <>
                  |
                  <Link href={`/${userId}/posts/edit/${post.POST_ID}`}>
                    <span className='mg-r-10 mg-l-10'>수정</span>
                  </Link>
                  |
                  <span className='mg-l-10 pointer' onClick={() => handleDelete()}>
                    삭제
                  </span>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className='toastui-editor-contents post_content' dangerouslySetInnerHTML={{ __html: htmlCntn }}></div>
          <div className='post_scrap_div'>
            <div className='post_scrap_ico' onClick={() => scrapPost('facebook')}>
              <i className='fa-brands fa-facebook-f'></i>
            </div>
            <div className='post_scrap_ico' onClick={() => scrapPost('twitter')}>
              <i className='fa-brands fa-twitter'></i>
            </div>
            <div id='post_url_copy' data-clipboard-target='#currentUrl' className='post_scrap_ico' onClick={() => scrapPost('cilpboard')}>
              <i className='fa-solid fa-paperclip'></i>
            </div>
            <input id='currentUrl' className='dn op0' type='text' value={currUrl} readOnly />
          </div>
        </div>
        <Snackbar
          open={showNoti}
          autoHideDuration={5000}
          message='링크가 복사되었습니다.'
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
      </PostLayout>
    </BlogLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let post;
  let imgFileArr: string[] = [];
  let htmlCntn = '';

  const cheerio = require('cheerio');

  const params = {
    type: 'read',
    postId: context.query.id,
  };

  await handleMySql(params)
    .then((res) => JSON.stringify(res))
    .then((res) => {
      post = JSON.parse(res).items[0];
      //html 데이터 추출
      htmlCntn = Buffer.from(post.POST_HTML_CNTN).toString();
      const $ = cheerio.load(htmlCntn);
      //기존 이미지 파일 이름 추출
      const imageTags = $('img');
      imgFileArr = imageTags.map((index: number, el: any) => $(el).attr('alt')).get();
    });

  return { props: { post, imgFileArr, htmlCntn } };
};

export default PostDetailPage;
