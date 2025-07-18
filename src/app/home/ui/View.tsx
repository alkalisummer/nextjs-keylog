'use client';

import { useState, Fragment } from 'react';
import { BoxError } from '@/shared/ui';
import { HomeInitData } from '../model';
import { Keyword } from '@/entities/trend/ui';
import { HomeTabs } from './homeTabs/HomeTabs';
import { AsyncBoundary } from '@/shared/boundary';
import { KeywordScroll } from '@/entities/trend/ui';
import { ArticleList } from '@/entities/article/ui';
import { SearchPost } from './searchPost/SearchPost';
import { ArticleListSkeleton } from '@/entities/article/ui';
import { useHome } from '../container';

export const View = ({ trends, initialArticles, initialPosts }: HomeInitData) => {
  const { trend, setTrend } = useHome();
  const [currentTab, setCurrentTab] = useState('keyword');

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
