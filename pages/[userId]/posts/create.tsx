import PostLayout from './postLayout';
import BlogLayout from '../blogLayout';
import TrendKeyword from '@/utils/TrendKeyword';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
const ToastEditor = dynamic(() => import('@/utils/ToastEditor'), { ssr: false });

interface user {
  id: string;
  email: string;
  image: string;
  nickname: string;
}

const CreatePost = ({ userInfo }: { userInfo: user }) => {
  const router = useRouter();
  const { userId } = router.query;

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
        <TrendKeyword />
        <ToastEditor
          mode={'insert'}
          postId={''}
        />
      </PostLayout>
    </BlogLayout>
  );
};

export default CreatePost;
