import PostLayout from './postLayout';
import BlogLayout from '../blogLayout';
import TrendKeyword from '@/utils/TrendKeyword';
import dynamic from 'next/dynamic';
const ToastEditor = dynamic(() => import('@/utils/ToastEditor'), { ssr: false });

interface user {
  id: string;
  email: string;
  image: string;
  nickname: string;
}

const CreatePost = ({ userInfo }: { userInfo: user }) => {
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
