import PostLayout from './postLayout';
import dynamic from 'next/dynamic';
const ToastEditor = dynamic(() => import('@/utils/ToastEditor'), { ssr: false });

const CreatePost = () => {
  return (
    <PostLayout>
      <ToastEditor
        mode={'insert'}
        postId={''}
        oriPost={null}
      />
    </PostLayout>
  );
};

export default CreatePost;
