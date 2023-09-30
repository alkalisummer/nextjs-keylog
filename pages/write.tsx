import TrendKeyword from '@/utils/TrendKeyword';
import dynamic from 'next/dynamic';
import React from 'react';
import Navbar from './components/Navbar';
import { useRouter } from 'next/router';
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

export default CreatePost;
