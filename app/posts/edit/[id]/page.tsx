import dynamic from 'next/dynamic';
const ToastEditor = dynamic(() => import('@/app/ToastEditor'), { ssr: false });

const EditPost = ({ params }: any) => {
  return (
    <ToastEditor
      mode={'update'}
      postId={params.id}
    />
  );
};

export default EditPost;
