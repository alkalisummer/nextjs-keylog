'use server';

import { getUser } from '@/entities/user/api';
import { getPost } from '@/entities/post/api';
import { PostDetails } from '@/entities/post/component';
import { getPostHashtags } from '@/entities/hashtag/api';
import { CommentList } from '@/features/comment/component';
import { PostHashtags } from '@/entities/hashtag/component';
import { PostInteractions } from '@/entities/like/component';

export const Page = async ({ params }: { params: Promise<{ userId: string; postId: string }> }) => {
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
};

export default Page;
