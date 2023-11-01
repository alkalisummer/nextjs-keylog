import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Custom500: NextPage = () => {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  return (
    <div className='error_div'>
      <span className='error_text'>{`Something went wrong!`}</span>
      <span className='error_text'>{`Error Code : 500`}</span>
      <Image width={330} height={330} className='error_image' src='/icon/errorImg.png' alt='errorImage'></Image>
      <button className='error_btn' onClick={() => goBack()}>
        Go Back
      </button>
    </div>
  );
};

export default Custom500;
