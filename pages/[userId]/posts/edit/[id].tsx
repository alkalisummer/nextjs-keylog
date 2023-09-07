import PostLayout from '../postLayout';
import BlogLayout from '../../blogLayout';
import { useRouter } from 'next/router';
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
