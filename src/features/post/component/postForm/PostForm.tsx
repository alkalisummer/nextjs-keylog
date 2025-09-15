import { View } from './ui/View';
import { getPost } from '@/entities/post/api';
import { queryKey } from '@/app/provider/query/lib';
import { QueryClient } from '@tanstack/react-query';
import { getCustomSession } from '@/shared/lib/util';
import { notFound, redirect } from 'next/navigation';
import { getPostHashtags } from '@/entities/hashtag/api';
import { dehydrate } from '@tanstack/react-query';
import { HydrateClient } from '@/app/provider/query/lib/HydrateClient';

interface Props {
  postId: number;
}

export const PostForm = async ({ postId }: Props) => {
  const queryClient = new QueryClient();
  const session = await getCustomSession();

  // 로그인 체크
  if (!session?.user?.id) {
    redirect(`/login?redirect=${encodeURIComponent('/write')}`);
  }

  const hashtagsQueryOptions = {
    queryKey: queryKey().hashtag().postHashtags(Number(postId)),
    queryFn: () => getPostHashtags(Number(postId)),
    enabled: !!postId,
  };

  const hashtagsRes = await queryClient.ensureQueryData(hashtagsQueryOptions);

  if (!hashtagsRes.ok) throw new Error('Hashtags fetch error');

  const hashtags = hashtagsRes.data.map(tag => tag.hashtagName) || [];

  const postQueryOptions = {
    queryKey: queryKey().post().postDetail(Number(postId)),
    queryFn: () => getPost(Number(postId)),
    enabled: !!postId,
  };

  const postRes = await queryClient.ensureQueryData(postQueryOptions);

  if (postId && !postRes.ok) notFound();

  const post = postRes.data;

  // 작성자 권한 체크
  if (postId && post && post.authorId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateClient state={dehydratedState}>
      <View hashtags={hashtags} post={post} authorId={session.user.id} />
    </HydrateClient>
  );
};
