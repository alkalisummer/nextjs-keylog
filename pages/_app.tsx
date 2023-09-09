import type { AppProps, AppContext } from 'next/app';
import { SessionProvider, getSession } from 'next-auth/react';
import Head from 'next/head';
import Script from 'next/script';

import axios from 'axios';

import '@/styles/globals.css';
import '@/styles/Post.css';
import '@/styles/ChatGpt.css';
import '@/styles/Navbar.css';
import '@/styles/Index.css';
import '@/styles/Error.css';

export default function App({ Component, pageProps }: AppProps) {
  const { session } = pageProps;
  return (
    <SessionProvider session={session}>
      <div className='main_area'>
        <Script
          src='https://kit.fontawesome.com/25678e103e.js'
          crossOrigin='anonymous'
        />
        <Head>
          <title> keylog </title>
          {/* <meta
            httpEquiv='Content-Security-Policy'
            content='upgrade-insecure-requests'></meta> */}
        </Head>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const session = await getSession(ctx);
  const userId = ctx.query.userId;
  let userInfo;

  if (userId) {
    const params = { type: 'getUser', id: userId };
    const user = await axios.post('http://localhost:3000/api/HandleUser', { data: params }).then((res) => {
      return JSON.parse(JSON.stringify(res.data.items[0]));
    });

    userInfo = {
      id: user.USER_ID,
      email: user.USER_EMAIL,
      image: user.USER_THMB_IMG_URL,
      nickname: user.USER_NICKNAME,
      blogName: user.USER_BLOG_NAME,
    };
  }

  pageProps = { ...pageProps, userInfo, session };

  return { pageProps };
};
