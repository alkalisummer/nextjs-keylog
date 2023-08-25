import PostLayout from './postLayout';
import TrendKeyword from '@/utils/TrendKeyword';
import dynamic from 'next/dynamic';
const ToastEditor = dynamic(() => import('@/utils/ToastEditor'), { ssr: false });

const CreatePost = () => {
  return (
    <PostLayout>
      <TrendKeyword />
      <ToastEditor
        mode={'insert'}
        postId={''}
      />
    </PostLayout>
  );
};

export default CreatePost;
