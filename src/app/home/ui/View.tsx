'use client';

import css from './view.module.scss';
import { HomeInitData } from '../model';
import { BoxError, BoxSkeleton } from '@/shared/ui';
import { Keyword } from '@/entities/trends/ui';
import { HomeTabs } from './homeTabs/HomeTabs';
import { SearchPost } from '@/entities/posts/ui';
import { AsyncBoundary } from '@/shared/boundary';
import { KeywordScroll } from '@/entities/trends/ui';
import { ArticleList } from '@/entities/articles/ui';
import { Fragment, useEffect, useState } from 'react';
import { useTrend } from '@/entities/trends/container/TrendsContainer';

export const View = ({ trends, initialArticles, initialPosts }: HomeInitData) => {
  const { trend, setTrend } = useTrend();
  const [currentTab, setCurrentTab] = useState('keyword');

  useEffect(() => {
    if (trends.length > 0) {
      setTrend(trends[0]);
    }
  }, [trends, setTrend]);

  return (
    <div className={css.module}>
      <HomeTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === 'keyword' ? (
        <Fragment>
          <AsyncBoundary pending={<BoxSkeleton height={50} />} error={<BoxError height={50} />}>
            <Keyword />
          </AsyncBoundary>
          <AsyncBoundary pending={<BoxSkeleton height={350} />} error={<BoxError height={350} />}>
            <KeywordScroll trends={trends} onClick={setTrend} />
          </AsyncBoundary>
          {initialArticles.length > 0 && (
            <AsyncBoundary pending={<BoxSkeleton height={150} />} error={<BoxError height={150} />}>
              <ArticleList trends={trends} initialArticles={initialArticles} />
            </AsyncBoundary>
          )}
        </Fragment>
      ) : (
        <AsyncBoundary pending={<BoxSkeleton height={500} />} error={<BoxError height={500} />}>
          <SearchPost initPosts={initialPosts} initPostsTotalCnt={initialPosts.length} />
        </AsyncBoundary>
      )}
    </div>
  );
};
