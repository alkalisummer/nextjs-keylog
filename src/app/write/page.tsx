'use server';

import { redirect } from 'next/navigation';
import { Write } from './ui/Write';
import { getPost } from '@/entities/post/api';
import { getPostHashtags } from '@/entities/hashtag/api';
import { getDailyTrends } from '@/entities/trend/api';
import { getCustomSession } from '@/shared/lib/util/auth/server';
// Remove unused imports

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
      redirect('/_error');
    }

    post = postRes.data;

    // 작성자 권한 체크
    if (post.authorId !== session.user.id) {
      redirect('/_error');
    }

    // 해시태그 조회
    const hashtagRes = await getPostHashtags(Number(postId));
    if (hashtagRes.ok) {
      hashtags = hashtagRes.data.map(tag => tag.hashtagName);
    }
  }

  // 트렌드 키워드 조회
  let trends: any[] = [];
  try {
    trends = await getDailyTrends({ geo: 'KR', hl: 'ko' });
  } catch (error) {
    console.error('Failed to fetch trends:', error);
  }
  return (
    <main>
      <Write post={post || undefined} hashtags={hashtags} trends={trends} authorId={session.user.id} />
    </main>
  );
};

export default Page;
