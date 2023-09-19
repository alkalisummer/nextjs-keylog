import PostLayout from '../postLayout';
import BlogLayout from '../../blogLayout';
import { useRouter } from 'next/router';
import CheckAuth from '@/utils/CheckAuth';
import ErrorPage from '@/pages/components/ErrorPage';
import dynamic from 'next/dynamic';
const ToastEditor = dynamic(() => import('@/utils/ToastEditor'), { ssr: false });

interface user {
  id: string;
  email: string;
  image: string;
  nickname: string;
  blogName: string;
}

interface recentPost {
  POST_ID: string;
  POST_TITLE: string;
  POST_THMB_IMG_URL: string;
  RGSN_DTTM: string;
}

interface popularPost {
  POST_ID: string;
  POST_TITLE: string;
  POST_THMB_IMG_URL: string;
  RGSN_DTTM: string;
  LIKE_CNT: number;
}

interface recentComment {
  POST_ID: string;
  COMMENT_ID: string;
  COMMENT_CNTN: string;
  USER_NICKNAME: string;
  RGSR_ID: string;
  RGSN_DTTM: string;
}

const EditPost = ({ userInfo, recentPosts, popularPosts, recentComments }: { userInfo: user; recentPosts: recentPost[]; popularPosts: popularPost[]; recentComments: recentComment[] }) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      {CheckAuth() ? (
        <BlogLayout userInfo={userInfo} recentPosts={recentPosts} popularPosts={popularPosts} recentComments={recentComments}>
          <PostLayout>
            <ToastEditor mode={'update'} postId={id as string} />
          </PostLayout>
        </BlogLayout>
      ) : (
        <ErrorPage errorText={'Unauthorized'}></ErrorPage>
      )}
    </>
  );
};

export default EditPost;
