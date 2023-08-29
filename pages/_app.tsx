import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';

import '@/styles/globals.css';
import '@/styles/Navbar.css';
import '@/styles/Index.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <div className='main_area'>
        <Script
          src='https://kit.fontawesome.com/25678e103e.js'
          crossOrigin='anonymous'
        />
        <Head>
          <title> keylog </title>
          <meta
            http-equiv='Content-Security-Policy'
            content='upgrade-insecure-requests'></meta>
        </Head>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
