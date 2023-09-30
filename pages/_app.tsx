import type { AppProps, AppContext } from 'next/app';
import { SessionProvider, getSession } from 'next-auth/react';
import { handleMySql as handleUser } from './api/HandleUser';
import { handleMySql as handlePost } from './api/HandlePost';
import { handleMySql as handleComment } from './api/HandleComment';
import Head from 'next/head';
import Script from 'next/script';
import Error from 'next/error';
import { useRouter } from 'next/router';

import axios from 'axios';

import '@/styles/globals.css';
import '@/styles/Post.css';
import '@/styles/ChatGpt.css';
import '@/styles/Navbar.css';
import '@/styles/Index.css';
import '@/styles/Error.css';
import '@/styles/leftArea.css';
import '@/styles/rightArea.css';
import '@/styles/write.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const { session, userInfo } = pageProps;
  const { userId } = router.query;

  if (userId && !userInfo.id) {
    return <Error statusCode={404} />;
  }
  return (
    <SessionProvider session={session}>
      <div className='main_area'>
        <Script src='https://kit.fontawesome.com/25678e103e.js' crossOrigin='anonymous' />
        <Head>
          <title> keylog </title>
          <meta property='og:type' content='website'></meta>
          <meta property='og:title' content='Keylog'></meta>
          <meta property='og:site_name' content='Keylog'></meta>
          <meta property='og:url' content='https://keylog.hopto.org'></meta>
          <meta property='og:image' content='https://keylog.hopto.org/keyword.png'></meta>
          <meta property='og:description' content='인기 키워드를 활용한 블로그 포스팅'></meta>
        </Head>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
  let pageProps = {};
  let recentPosts;
  let popularPosts;
  let recentComments;
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  // 화면 갱신시 useSession으로 가져오는 사용자 정보 데이터가 깜빡이는것을 방지 하기 위함
  const session = await getSession(ctx);

  const userId = ctx.query.userId;
  let userInfo;

  if (userId) {
    const params = { type: 'getUser', id: userId };
    let user;

    if (ctx.req) {
      user = await handleUser(params).then((res) => {
        return res.totalItems === 0 ? {} : JSON.parse(JSON.stringify(res.items[0]));
      });

      // 최근 게시글 5개
      params.type = 'getRecentPost';
      await handlePost(params).then((res) => {
        const result = JSON.parse(JSON.stringify(res));
        recentPosts = result.items;
      });

      // 인기 게시글 5개
      params.type = 'getPopularPost';
      await handlePost(params).then((res) => {
        const result = JSON.parse(JSON.stringify(res));
        popularPosts = result.items;
      });

      // 최근 댓글 5개
      params.type = 'getRecentComment';
      await handleComment(params).then((res) => {
        const result = JSON.parse(JSON.stringify(res));
        recentComments = result.items;
      });
    } else {
      user = await axios.post('/api/HandleUser', { data: params }).then((res) => {
        return res.data.totalItems === 0 ? {} : JSON.parse(JSON.stringify(res.data.items[0]));
      });
      // 최근 게시글 5개, 인기 게시글 5개
      params.type = 'getRecentPost';
      await axios.post('/api/HandlePost', { data: params }).then((res) => {
        const result = JSON.parse(JSON.stringify(res.data));
        recentPosts = result.items;
        popularPosts = result.popularPosts;
      });
      // 최근 댓글 5개
      params.type = 'getRecentComment';
      await axios.post('/api/HandleComment', { data: params }).then((res) => {
        const result = JSON.parse(JSON.stringify(res.data));
        recentComments = result.items;
      });
    }

    userInfo = {
      id: user.USER_ID,
      email: user.USER_EMAIL,
      image: user.USER_THMB_IMG_URL,
      nickname: user.USER_NICKNAME,
      blogName: user.USER_BLOG_NAME,
    };
  }

  pageProps = { ...pageProps, userInfo, session, recentPosts, popularPosts, recentComments };

  return { pageProps };
};
