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
}

const CreatePost = ({ userInfo }: { userInfo: user }) => {
  return (
    <>
      {CheckAuth() ? (
        <BlogLayout userInfo={userInfo}>
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
