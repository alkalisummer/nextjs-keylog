import '@toast-ui/editor/dist/toastui-editor.css';
import Link from 'next/link';
import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/router';
import { timeFormat } from '@/utils/CommonUtils';
import PostLayout from '../postLayout';
import { GetServerSideProps } from 'next';

const PostDetailPage = ({ post }: any, { imgFileArr }: any) => {
  const router = useRouter();
  const { id } = router.query;

  //html data 추출
  const htmlData = Buffer.from(post.post_html_cntn.data).toString();

  const handleDelete = async () => {
    const param = { type: 'delete', postId: id };
    await axios.get('/api/HandlePost', { params: param }).then(() => {
      // 해당 게시글 이미지 삭제
      let removedImg = imgFileArr;
      axios.post('/api/DeleteImgFile', { removedImg });

      //router.refresh();
      router.push('/');
    });
  };
  return (
    <PostLayout>
      <div className='post_div'>
        <div className='post_title_created'>
          <span className='post_title'>{post.post_title}</span>
          <div className='post_created'>
            <span className='mg-r-10 pointer'>{timeFormat(post.amnt_dttm)}</span>|
            <Link href={`/posts/edit/${id}`}>
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
          dangerouslySetInnerHTML={{ __html: htmlData }}></div>
      </div>
    </PostLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let post: {} = {};
  let imgFileArr: string[] = [];

  const cheerio = require('cheerio');

  const param = {
    type: 'read',
    postId: context.query.id,
  };
  await axios.get('http://localhost:3000/api/HandlePost', { params: param }).then((res) => {
    post = res.data.items[0];
    //html 데이터 추출
    const htmlCntn = Buffer.from(res.data.items[0].post_html_cntn).toString();
    const $ = cheerio.load(htmlCntn);
    //기존 이미지 파일 이름 추출
    const imageTags = $('img');
    imgFileArr = imageTags.map((index: number, el: any) => $(el).attr('alt')).get();
  });

  return { props: { post, imgFileArr } };
};

export default PostDetailPage;
