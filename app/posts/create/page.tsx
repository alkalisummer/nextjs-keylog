import dynamic from 'next/dynamic';
const ToastEditor = dynamic(() => import('@/app/ToastEditor'), { ssr: false });

const CreatePost = () => {
  return (
    <ToastEditor
      mode={'insert'}
      postId={''}
    />
  );
};

export default CreatePost;
