'use server';

import { BoxError } from '@/shared/ui';
import { getPost } from '@/entities/post/api';
import { getLikeCnt } from '@/entities/like/api';
import { queryKey } from '@/app/provider/query/lib';
import { QueryClient } from '@tanstack/react-query';
import { getCommentList } from '@/entities/comment/api';
import { getPostHashtags } from '@/entities/hashtag/api';

export const Page = async ({ params }: { params: Promise<{ userId: string; postId: string }> }) => {
  const { userId, postId } = await params;

  const queryClient = new QueryClient();

  //post detail
  const postQueryOptions = {
    queryKey: queryKey().post().postDetail(postId),
    queryFn: () => getPost(postId),
  };

  await queryClient.prefetchQuery(postQueryOptions);
  const postRes = await queryClient.ensureQueryData(postQueryOptions);

  if (!postRes.ok) {
    throw new Error('Post fetch error');
  }

  //comments
  const commentsQueryOptions = {
    queryKey: queryKey().comment().commentList(postId),
    queryFn: () => getCommentList(postId),
  };

  await queryClient.prefetchQuery(commentsQueryOptions);
  const commentsRes = await queryClient.ensureQueryData(commentsQueryOptions);

  if (!commentsRes.ok) {
    throw new Error('Comments fetch error');
  }

  //like
  const likeQueryOptions = {
    queryKey: queryKey().like().likeCnt(postId),
    queryFn: () => getLikeCnt(postId),
  };

  await queryClient.prefetchQuery(likeQueryOptions);
  const likeRes = await queryClient.ensureQueryData(likeQueryOptions);

  if (!likeRes.ok) {
    throw new Error('Like fetch error');
  }

  //hashtags
  const hashtagsQueryOptions = {
    queryKey: queryKey().hashtag().postHashtags(postId),
    queryFn: () => getPostHashtags(postId),
  };

  await queryClient.prefetchQuery(hashtagsQueryOptions);
  const postHashtagsRes = await queryClient.ensureQueryData(hashtagsQueryOptions);

  if (!postHashtagsRes.ok) {
    throw new Error('Hashtags fetch error');
  }

  return <div>PostDetailPage</div>;
};

export default Page;
