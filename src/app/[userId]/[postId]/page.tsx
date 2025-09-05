'use server';

import { getUser } from '@/entities/user/api';
import { getPost } from '@/entities/post/api';
import { QueryClient } from '@tanstack/react-query';
import { queryKey } from '@/app/provider/query/lib';
import { PostDetails } from '@/entities/post/component';
import { getPostHashtags } from '@/entities/hashtag/api';
import { CommentList } from '@/features/comment/component';
import { PostHashtags } from '@/entities/hashtag/component';
import { PostInteractions } from '@/entities/like/component';

export default async function Page({ params }: { params: Promise<{ userId: string; postId: string }> }) {
  const { userId, postId } = await params;

  const user = getUser(userId);
  const post = getPost(Number(postId));
  const hashtags = getPostHashtags(Number(postId));

  return (
    <>
      <PostDetails promise={{ user, post }} userId={userId} postId={Number(postId)} />
      <PostInteractions promise={{ post }} postId={Number(postId)} />
      <PostHashtags promise={{ hashtags }} postId={Number(postId)} />
      <CommentList postId={Number(postId)} />
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ userId: string; postId: string }> }) {
  const { userId, postId } = await params;
  const queryClient = new QueryClient();
  const url = `${process.env.BASE_URL}/${userId}/${postId}`;

  const postRes = await queryClient.ensureQueryData({
    queryKey: queryKey().post().postDetail(Number(postId)),
    queryFn: () => getPost(Number(postId)),
  });

  const userRes = await queryClient.ensureQueryData({
    queryKey: queryKey().user().userInfo(userId),
    queryFn: () => getUser(userId),
  });

  if (postRes.data && userRes.data) {
    const post = postRes.data;
    const user = userRes.data;
    return {
      title: post.postTitle,
      description: post.postCntn,
      icons: {
        icon: [
          {
            url: user.userThmbImgUrl ?? '/favicon.ico',
            sizes: '180x180',
          },
        ],
        apple: [
          {
            url: '/favicon.ico',
            sizes: '180x180',
          },
        ],
      },
      openGraph: {
        type: 'article',
        url: url,
        title: post.postTitle,
        description: `${user.userNickname} - ${user.userBlogName}`,
        images: [
          {
            url: post.postThmbImgUrl ?? '/favicon.ico',
            width: 250,
            height: 250,
            alt: post.postTitle,
          },
        ],
      },
      alternates: {
        canonical: url,
      },
    };
  }
}
