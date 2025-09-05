'use server';

import { BoxError } from '@/shared/ui';
import { HomeContainer } from './container';
import { HomeTabs } from './ui/homeTabs/HomeTabs';
import { AsyncBoundary } from '@/shared/boundary';
import { Keyword } from '@/entities/trend/component';
import { getDailyTrends } from '@/entities/trend/api';
import { PostSearch } from '@/features/post/component';
import { KeywordScroll } from '@/entities/trend/component';
import { ArticleList } from '@/entities/article/component';
import { PostSearchSkeleton } from '@/features/post/component';
import { ArticleListSkeleton } from '@/entities/article/component';

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export const Page = async ({ searchParams }: Props) => {
  const { tagId = '', tab = 'keyword' } = await searchParams;
  const dailyTrends = getDailyTrends({ geo: 'KR', hl: 'ko' });

  const dailyTrendsRes = await dailyTrends;

  if (!dailyTrendsRes.ok) throw new Error('dailyTrends fetch error');

  const trends = dailyTrendsRes.data;
  const initTrend = dailyTrendsRes.data[0];

  return (
    <HomeContainer initTrend={initTrend} initTab={tab}>
      <HomeTabs />
      <main>
        <Keyword />
        <KeywordScroll trends={trends} />
        <AsyncBoundary pending={<ArticleListSkeleton />} error={<BoxError height={450} />}>
          <ArticleList trends={trends} />
        </AsyncBoundary>
        <AsyncBoundary pending={<PostSearchSkeleton />} error={<BoxError height={150} />}>
          <PostSearch tagId={tagId} />
        </AsyncBoundary>
      </main>
    </HomeContainer>
  );
};

export const generateMetadata = async () => {
  return {
    title: 'keylog',
    description: '인기 키워드를 활용한 블로그 포스팅',
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
      url: `${process.env.BASE_URL}`,
      title: 'keylog',
      description: '인기 키워드를 활용한 블로그 포스팅',
    },
    alternates: {
      canonical: `${process.env.BASE_URL}`,
    },
  };
};

export default Page;
