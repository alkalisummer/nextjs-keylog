/* eslint-disable @next/next/no-img-element */
import type { AppProps } from 'next/app';
import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@/styles/globals.css';
import '@/styles/Post.css';
import '@/styles/ChatGpt.css';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <div className='main_area'>
        <Head>
          <title> kyuuun </title>
        </Head>
        <div className='left_area'>
          <Link href={'/'}>
            <img
              src='/icon/myImg.jpeg'
              className='left_profile_icon'
              alt='profile img'
            />
          </Link>
          <Link href={'/'}>
            <span className='left_area_title'>{`kyuuun`}</span>
          </Link>
          <div className='left_area_btn_div'>
            <Link href={'/posts/create'}>
              <button className='create_btn'></button>
            </Link>
            <Link href={'/chatGpt'}>
              <button className='chatgpt_btn'></button>
            </Link>
          </div>
        </div>
        <div className='right_area'>
          <Component {...pageProps} />
          <div className='right_footer'>
            This app is built with &nbsp;<span className='right_footer_text'>Next.js</span>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
