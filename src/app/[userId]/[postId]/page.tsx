'use server';

import { BoxError } from '@/shared/ui';
import { getUser } from '@/entities/user/api';
import { getPost } from '@/entities/post/api';
import { PostDetails } from '@/entities/post/ui';
import { AsyncBoundary } from '@/shared/boundary';
import { CommentList } from '@/features/comment/ui';
import { queryKey } from '@/app/provider/query/lib';
import { QueryClient } from '@tanstack/react-query';
import { PostHashtags } from '@/entities/hashtag/ui';
import { PostInteractions } from '@/entities/like/ui';
import { getCommentList } from '@/entities/comment/api';
import { getPostHashtags } from '@/entities/hashtag/api';

export const Page = async ({ params }: { params: Promise<{ userId: string; postId: string }> }) => {
  const { userId, postId } = await params;
  const queryClient = new QueryClient();

  //user
  const userQueryOptions = {
    queryKey: queryKey().user().userInfo(userId),
    queryFn: () => getUser(userId),
  };

  await queryClient.prefetchQuery(userQueryOptions);
  const userRes = await queryClient.ensureQueryData(userQueryOptions);

  if (!userRes.ok) {
    throw new Error('User fetch error');
  }

  //post detail
  const postQueryOptions = {
    queryKey: queryKey().post().postDetail(Number(postId)),
    queryFn: () => getPost(Number(postId)),
  };

  await queryClient.prefetchQuery(postQueryOptions);
  const postRes = await queryClient.ensureQueryData(postQueryOptions);

  if (!postRes.ok) {
    throw new Error('Post fetch error');
  }

  //comments
  const commentsQueryOptions = {
    queryKey: queryKey().comment().commentList(Number(postId)),
    queryFn: () => getCommentList(Number(postId)),
  };

  await queryClient.prefetchQuery(commentsQueryOptions);
  const commentsRes = await queryClient.ensureQueryData(commentsQueryOptions);

  if (!commentsRes.ok) {
    throw new Error('Comments fetch error');
  }

  //hashtags
  const hashtagsQueryOptions = {
    queryKey: queryKey().hashtag().postHashtags(Number(postId)),
    queryFn: () => getPostHashtags(Number(postId)),
  };

  await queryClient.prefetchQuery(hashtagsQueryOptions);
  const postHashtagsRes = await queryClient.ensureQueryData(hashtagsQueryOptions);

  if (!postHashtagsRes.ok) {
    throw new Error('Hashtags fetch error');
  }

  return (
    <AsyncBoundary pending={<div>Loading...</div>} error={<BoxError height={500} />}>
      <PostDetails post={postRes.data} user={userRes.data} />
      <PostInteractions postId={Number(postId)} postTitle={postRes.data.postTitle} />
      <PostHashtags hashtags={postHashtagsRes.data} />
      <CommentList postId={Number(postId)} />
    </AsyncBoundary>
  );
};

export default Page;
