import TrendKeyword from '@/utils/TrendKeyword';
import dynamic from 'next/dynamic';
import React from 'react';
import Navbar from './components/Navbar';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { handleMySql as handlePost } from './api/HandlePost';
import { getSession } from 'next-auth/react';
const ToastEditor = dynamic(() => import('@/utils/ToastEditor'), { ssr: false });

const CreatePost = () => {
  const router = useRouter();
  const { postId, keyword } = router.query;

  return (
    <div className='write_div'>
      <div className='write_header_div'>
        <span className='write_header_logo' onClick={() => router.push('/')}>
          keylog
        </span>
        <Navbar></Navbar>
      </div>
      <div className={`write_main_div ${keyword ? '' : 'jc_c'}`}>
        <ToastEditor postId={postId as string | undefined} />
        {keyword ? (
          <div className='write_keyword_div'>
            <TrendKeyword />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const postId = context.query.postId;

  if (postId) {
    const currUserId = await getSession(context).then((res) => res?.user?.id);
    const params = { type: 'read', postId: postId };
    const rgsrId = await handlePost(params).then((res) => res.items[0].RGSR_ID);

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
    props: {},
  };
};

export default CreatePost;
