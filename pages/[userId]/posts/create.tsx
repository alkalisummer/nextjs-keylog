import PostLayout from './postLayout';
import BlogLayout from '../blogLayout';
import TrendKeyword from '@/utils/TrendKeyword';
import dynamic from 'next/dynamic';
import CheckAuth from '@/utils/CheckAuth';
import ErrorPage from '@/pages/components/ErrorPage';
const ToastEditor = dynamic(() => import('@/utils/ToastEditor'), { ssr: false });

interface user {
  id: string;
  email: string;
  image: string;
  nickname: string;
  blogName: string;
}

interface recentPost {
  POST_TITLE: string;
  POST_THMB_IMG_URL: string;
  RGSN_DTTM: string;
}

interface popularPost {
  POST_TITLE: string;
  POST_THMB_IMG_URL: string;
  RGSN_DTTM: string;
  LIKE_CNT: number;
}

interface recentComment {
  COMMENT_CNTN: string;
  USER_NICKNAME: string;
  RGSR_ID: string;
  RGSN_DTTM: string;
}

const CreatePost = ({ userInfo, recentPosts, popularPosts, recentComments }: { userInfo: user; recentPosts: recentPost[]; popularPosts: popularPost[]; recentComments: recentComment[] }) => {
  return (
    <>
      {CheckAuth() ? (
        <BlogLayout userInfo={userInfo} recentPosts={recentPosts} popularPosts={popularPosts} recentComments={recentComments}>
          <PostLayout>
            <TrendKeyword />
            <ToastEditor mode={'insert'} postId={''} />
          </PostLayout>
        </BlogLayout>
      ) : (
        <ErrorPage errorText={'Unauthorized'}></ErrorPage>
      )}
    </>
  );
};

export default CreatePost;
