'use client';

import css from './view.module.scss';
import { BoxError } from '@/shared/ui';
import { HomeInitData } from '../model';
import { Keyword } from '@/entities/trends/ui';
import { HomeTabs } from './homeTabs/HomeTabs';
import { SearchPost } from '@/entities/posts/ui';
import { AsyncBoundary } from '@/shared/boundary';
import { KeywordScroll } from '@/entities/trends/ui';
import { ArticleList } from '@/entities/articles/ui';
import { Fragment, useEffect, useState } from 'react';
import { ArticleListSkeleton } from '@/entities/articles/ui';
import { useTrend } from '@/entities/trends/container/TrendsContainer';

export const View = ({ trends, initialArticles, initialPosts }: HomeInitData) => {
  const { trend, setTrend } = useTrend();

  const [currentTab, setCurrentTab] = useState('keyword');

  return (
    <div className={css.module}>
      <HomeTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === 'keyword' ? (
        <Fragment>
          <Keyword />
          <KeywordScroll trends={trends} selectedTrend={trend} onClick={setTrend} />
          {initialArticles.length > 0 && (
            <AsyncBoundary pending={<ArticleListSkeleton />} error={<BoxError height={150} />}>
              <ArticleList trends={trends} initialArticles={initialArticles} />
            </AsyncBoundary>
          )}
        </Fragment>
      ) : (
        <SearchPost initPosts={initialPosts} initPostsTotalCnt={initialPosts.length} />
      )}
    </div>
  );
};
