import TrendKeyword from '@/utils/TrendKeyword';
import dynamic from 'next/dynamic';
import React from 'react';
import Navbar from '../../src/widgets/Navbar';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { handleMySql as handlePost } from '@/app/api/HandlePost';
import { handleMySql as handleHashtag } from '@/app/api/HandleHashtag';
import { getSession } from 'next-auth/react';
const ToastEditor = dynamic(() => import('@/utils/ToastEditor'), { ssr: false });

interface hashtag {
  HASHTAG_ID: string;
  HASHTAG_NAME: string;
  HASHTAG_CNT: string;
}

const CreatePost = ({ post, hashtagArr }: { post: any; hashtagArr: string[] }) => {
  const router = useRouter();
  const { postId, keyword } = router.query;

  return (
    <div className="write_div">
      <div className="write_header_div">
        <span className="write_header_logo" onClick={() => router.push('/')}>
          keylog
        </span>
        <Navbar></Navbar>
      </div>
      <div className={`write_main_div ${keyword ? '' : 'jc_c'}`}>
        <ToastEditor postId={postId as string | undefined} post={post} tagArr={hashtagArr} />
        {keyword ? (
          <div className="write_keyword_div">
            <TrendKeyword />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const postId = context.query.postId;
  let post: any;
  let hashtagArr: any;

  if (postId) {
    const currUserId = await getSession(context).then(res => res?.user?.id);
    const params = { type: 'read', postId: postId };
    await handlePost(params)
      .then(res => JSON.stringify(res))
      .then(res => {
        const result = JSON.parse(res);
        post = result.items[0];
        hashtagArr = result.hashtagArr.map((hashtag: hashtag) => hashtag.HASHTAG_NAME);
      });

    params.type = 'getHashtag';
    await handleHashtag(params)
      .then(res => JSON.stringify(res))
      .then(res => {
        const result = JSON.parse(res).items;
        hashtagArr = result.map((hashtag: hashtag) => hashtag.HASHTAG_NAME);
      });

    const rgsrId = post.RGSR_ID;

    //글 수정시 현재 session user id 와 글 작성자 id가 일치하지 않으면 error 페이지로 redirect
    if (currUserId !== rgsrId) {
      return {
        redirect: {
          permanent: false,
          destination: '/_error',
        },
      };
    }
  }
  return {
    props: { post: post || null, hashtagArr: hashtagArr || null },
  };
};

export default CreatePost;
