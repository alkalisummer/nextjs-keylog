import PostLayout from '../postLayout';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import GetPost from '@/utils/GetPost';
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
        oriPost={post}
      />
    </PostLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let post: {} = {};

  const params = {
    type: 'read',
    postId: context.query.id,
  };
  await GetPost({ params }).then((res) => {
    const result = JSON.parse(res);
    post = result.items[0];
  });

  return { props: { post } };
};

export default EditPost;
