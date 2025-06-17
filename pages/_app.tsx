import type { AppProps, AppContext } from 'next/app';
import { SessionProvider, getSession } from 'next-auth/react';

import RefreshTokenHandler from '../src/widgets/RefreshTokenHandler';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';
import Script from 'next/script';
import { storePathValues } from '@/utils/CommonUtils';

//redux, redux-saga
import wrapper from '../store';

//css
import '@/styles/globals.css';
import '@/styles/Post.css';
import '@/styles/ChatGpt.css';
import '@/styles/Navbar.css';
import '@/styles/Index.css';
import '@/styles/Error.css';
import '@/styles/leftArea.css';
import '@/styles/rightArea.css';
import '@/styles/write.css';

const App = ({ Component, pageProps }: AppProps) => {
  const [sessionRefetchInterval, setSessionRefetchInterval] = useState(10000);
  const { session } = pageProps;
  const router = useRouter();

  useEffect(() => storePathValues(''), [router.asPath]);

  return (
    <SessionProvider session={session} refetchInterval={sessionRefetchInterval}>
      <div className="main_area">
        <Script src="https://kit.fontawesome.com/25678e103e.js" crossOrigin="anonymous" />
        <Head>
          <title> keylog </title>
          <meta property="og:type" content="website"></meta>
          <meta property="og:title" content="Keylog"></meta>
          <meta property="og:site_name" content="Keylog"></meta>
          <meta property="og:url" content="https://keylog.hopto.org"></meta>
          <meta property="og:image" content="https://keylog.hopto.org/keyword.png"></meta>
          <meta property="og:description" content="인기 키워드를 활용한 블로그 포스팅"></meta>
          <meta name="viewport" content="initial-scale=1.0, user-scalable=no, maximum-scale=1, width=device-width" />
        </Head>
        <Component {...pageProps} />
      </div>
      <RefreshTokenHandler setSessionRefetchInterval={setSessionRefetchInterval} />
    </SessionProvider>
  );
};

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  // 화면 갱신시 useSession으로 가져오는 사용자 정보 데이터가 깜빡이는것을 방지 하기 위함
  const session = await getSession(ctx);

  pageProps = { ...pageProps, session };

  return { pageProps };
};

export default wrapper.withRedux(App);
