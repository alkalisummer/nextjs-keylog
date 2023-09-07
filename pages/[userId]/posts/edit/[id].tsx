import PostLayout from '../postLayout';
import BlogLayout from '../../blogLayout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  const { id, userId } = router.query;

  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;

  useEffect(() => {
    if (status !== 'authenticated' || currentUserId !== userId) {
      alert('접근 권한이 없습니다.');
      router.push('/');
    }
  }, []);
  return (
    <BlogLayout userInfo={userInfo}>
      <PostLayout>
        <ToastEditor
          mode={'update'}
          postId={id as string}
        />
      </PostLayout>
    </BlogLayout>
  );
};

export default EditPost;
