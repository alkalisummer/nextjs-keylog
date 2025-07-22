'use client';

import { useHome } from '../container';
import { BoxError } from '@/shared/ui';
import { HomeInitData } from '../model';
import { useState, Fragment } from 'react';
import { Keyword } from '@/entities/trend/ui';
import { HomeTabs } from './homeTabs/HomeTabs';
import { AsyncBoundary } from '@/shared/boundary';
import { useSearchParams } from 'next/navigation';
import { KeywordScroll } from '@/entities/trend/ui';
import { ArticleList } from '@/entities/article/ui';
import { SearchPost } from './searchPost/SearchPost';
import { ArticleListSkeleton } from '@/entities/article/ui';

export const View = ({ trends, initialArticles, initialPosts }: HomeInitData) => {
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');
  const { trend, setTrend } = useHome();
  const [currentTab, setCurrentTab] = useState(tab || 'keyword');

  return (
    <Fragment>
      <HomeTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === 'keyword' ? (
        <main>
          <Keyword />
          <KeywordScroll trends={trends} selectedTrend={trend} onClick={setTrend} />
          {initialArticles.length > 0 && (
            <AsyncBoundary pending={<ArticleListSkeleton />} error={<BoxError height={150} />}>
              <ArticleList trends={trends} initialArticles={initialArticles} />
            </AsyncBoundary>
          )}
        </main>
      ) : (
        <SearchPost initPosts={initialPosts} initPostsTotalCnt={initialPosts.length} />
      )}
    </Fragment>
  );
};
