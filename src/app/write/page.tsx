'use server';

import { Write } from './ui/Write';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getPost } from '@/entities/post/api';
import { getDailyTrends } from '@/entities/trend/api';
import { getPostHashtags } from '@/entities/hashtag/api';
import { getCustomSession } from '@/shared/lib/util';

interface PageProps {
  searchParams: Promise<{ postId?: string }>;
}

export const Page = async ({ searchParams }: PageProps) => {
  const { postId } = await searchParams;
  const session = await getCustomSession();

  // 로그인 체크
  if (!session?.user?.id) {
    redirect(`/login?redirect=${encodeURIComponent('/write')}`);
  }

  let post = null;
  let hashtags: string[] = [];

  // postId가 있으면 수정 모드
  if (postId) {
    const postRes = await getPost(Number(postId));
    if (!postRes.ok) {
      notFound();
    }

    post = postRes.data;

    // 작성자 권한 체크
    if (post.authorId !== session.user.id) {
      throw new Error('Unauthorized');
    }

    // 해시태그 조회
    const hashtagRes = await getPostHashtags(Number(postId));
    if (hashtagRes.ok) {
      hashtags = hashtagRes.data.map(tag => tag.hashtagName);
    }
  }

  // 트렌드 키워드 조회
  const trends = await getDailyTrends({ geo: 'KR', hl: 'ko' });

  return (
    <main>
      <Write post={post || undefined} hashtags={hashtags} trends={trends} authorId={session.user.id} />
    </main>
  );
};

export default Page;
