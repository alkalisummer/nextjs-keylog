import '@toast-ui/editor/dist/toastui-editor.css';
import Link from 'next/link';
import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/router';
import { timeFormat } from '@/utils/CommonUtils';
import PostLayout from '../postLayout';
import { useEffect, useState } from 'react';

interface post {
  post_title: string;
  post_html_cntn: string;
  amnt_dttm: string;
}

const PostDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  //html data 추출
  const cheerio = require('cheerio');

  const [post, setPost] = useState({ post_title: '', post_cntn: '', post_html_cntn: { data: [] }, amnt_dttm: '' });
  const [imgFileArr, setImgFileArr] = useState<string[]>([]);

  useEffect(() => {
    const param = { type: 'read', postId: id };
    const getPost = async () => {
      param.type = 'read';
      await axios.get('/api/HandlePost', { params: param }).then((res) => {
        setPost(res.data.items[0]);

        //html 데이터 추출
        const htmlCntn = Buffer.from(res.data.items[0].post_html_cntn).toString();
        const $ = cheerio.load(htmlCntn);

        //기존 이미지 파일 이름 추출
        const imageTags = $('img');
        const currImageArr = imageTags.map((index: number, el: any) => $(el).attr('alt')).get();

        setImgFileArr(currImageArr);
      });
    };
    getPost();
  }, [id, cheerio]);

  const handleDelete = async () => {
    const param = { type: 'delete', postId: id };
    await axios.get('/api/HandlePost', { params: param }).then(() => {
      // 해당 게시글 이미지 삭제
      let removedImg = imgFileArr;
      axios.post('/api/DeleteImgFile', { removedImg });
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
          dangerouslySetInnerHTML={{ __html: Buffer.from(post.post_html_cntn.data).toString() }}></div>
      </div>
    </PostLayout>
  );
};

export default PostDetailPage;
