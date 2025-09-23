'use server';

import { BoxError } from '@/shared/ui';
import { HomeContainer } from '../container';
import { HomeTabs } from '../ui/homeTabs/HomeTabs';
import { AsyncBoundary } from '@/shared/boundary';
import { getDailyTrends } from '@/entities/trend/api';
import { PostSearch, PostSearchSkeleton } from '@/features/post/component';

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Page({ searchParams }: Props) {
  const { tagId = '' } = await searchParams;
  const dailyTrendsRes = await getDailyTrends({ geo: 'KR', hl: 'ko' });
  if (!dailyTrendsRes.ok) throw new Error('dailyTrends fetch error');
  const initTrend = dailyTrendsRes.data[0];

  return (
    <HomeContainer initTrend={initTrend}>
      <HomeTabs />
      <main>
        <AsyncBoundary pending={<PostSearchSkeleton />} error={<BoxError height={150} />}>
          <PostSearch tagId={tagId} />
        </AsyncBoundary>
      </main>
    </HomeContainer>
  );
}

export const generateMetadata = async () => {
  return {
    title: 'keylog',
    description: '게시물 검색',
    icons: {
      icon: [
        {
          url: '/favicon.ico',
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
      type: 'website',
      url: `${process.env.BASE_URL}/home/searchPosts`,
      title: 'keylog',
      description: '게시물 검색',
      images: [
        {
          url: '/logo.png',
          width: 650,
          height: 250,
        },
      ],
    },
    alternates: {
      canonical: `${process.env.BASE_URL}/home/searchPosts`,
    },
  };
};
