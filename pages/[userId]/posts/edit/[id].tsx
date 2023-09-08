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
}
const EditPost = ({ userInfo }: { userInfo: user }) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      {CheckAuth() ? (
        <BlogLayout userInfo={userInfo}>
          <PostLayout>
            <ToastEditor
              mode={'update'}
              postId={id as string}
            />
          </PostLayout>
        </BlogLayout>
      ) : (
        <ErrorPage errorText={'Unauthorized'}></ErrorPage>
      )}
    </>
  );
};

export default EditPost;
