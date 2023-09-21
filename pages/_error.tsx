import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { NextPageContext } from 'next';

const Error = ({ statusCode }: { statusCode: number }) => {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  return (
    <div className='error_div'>
      <span className='error_text'>{`Something went wrong!`}</span>
      <span className='error_text'>{`Error Code : ${statusCode}`}</span>
      <Image width={330} height={330} className='error_image' src='/icon/errorImg.png' alt='errorImage'></Image>
      <button className='error_btn' onClick={() => goBack()}>
        Go Back
      </button>
    </div>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
