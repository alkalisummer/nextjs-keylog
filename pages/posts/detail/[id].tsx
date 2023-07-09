import '@toast-ui/editor/dist/toastui-editor.css';
import Link from 'next/link';
import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/router';
import { timeFormat } from '@/utils/CommonUtils';
import PostLayout from '../postLayout';
import { GetServerSideProps } from 'next';
import { handleMySql } from '@/pages/api/HandlePost';

interface post {
  POST_ID: string;
  POST_TITLE: string;
  AMNT_DTTM: string;
}

const PostDetailPage = ({ post, imgFileArr, htmlCntn }: { post: post; imgFileArr: []; htmlCntn: string }) => {
  const router = useRouter();
  console.log(post);

  const handleDelete = async () => {
    const param = { type: 'delete', postId: post.POST_ID };
    console.log(imgFileArr);
    await axios.get('/api/HandlePost', { params: param }).then(() => {
      // 해당 게시글 이미지 삭제
      let removedImg = imgFileArr;
      console.log(imgFileArr);
      axios.post('/api/DeleteImgFile', { removedImg });
      router.push('/');
    });
  };
  return (
    <PostLayout>
      <div className='post_div'>
        <div className='post_title_created'>
          <span className='post_title'>{post.POST_TITLE}</span>
          <div className='post_created'>
            <span className='mg-r-10 pointer'>{timeFormat(post.AMNT_DTTM)}</span>|
            <Link href={`/posts/edit/${post.POST_ID}`}>
              <span className='mg-r-10 mg-l-10'>수정</span>
            </Link>
            |
            <span
              className='mg-l-10 pointer'
              onClick={() => handleDelete()}>
              삭제
            </span>
          </div>
        </div>
        <div
          className='toastui-editor-contents post_content'
          dangerouslySetInnerHTML={{ __html: htmlCntn }}></div>
      </div>
    </PostLayout>
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
