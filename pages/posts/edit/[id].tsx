import PostLayout from '../postLayout';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
const ToastEditor = dynamic(() => import('@/utils/ToastEditor'), { ssr: false });

interface post {
  post_title: string;
  post_html_cntn: string;
}
const EditPost = ({ post }: { post: post }) => {
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
