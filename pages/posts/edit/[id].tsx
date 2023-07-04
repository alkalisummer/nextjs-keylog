import PostLayout from '../postLayout';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const ToastEditor = dynamic(() => import('@/utils/ToastEditor'), { ssr: false });

const EditPost = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <PostLayout>
      <ToastEditor
        mode={'update'}
        postId={id as string}
      />
    </PostLayout>
  );
};

export default EditPost;
