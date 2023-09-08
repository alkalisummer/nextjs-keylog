import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Signup from '../../public/icon/errorImg.png';

const ErrorPage = ({ errorText }: { errorText: string }) => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };
  return (
    <div className='error_div'>
      <span className='error_text'>{errorText}</span>
      <Image
        width={330}
        height={330}
        className='error_image'
        src='/icon/errorImg.png'
        alt='errorImage'></Image>
      <button
        className='error_btn'
        onClick={() => goBack()}>
        Go Back
      </button>
    </div>
  );
};

export default ErrorPage;
