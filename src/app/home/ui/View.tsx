'use client';

import css from './view.module.scss';
import { Keyword } from '@/entities/trends/ui';
import { HomeTabs } from './homeTabs/HomeTabs';
import { SearchPost } from '@/entities/posts/ui';
import { KeywordScroll } from '@/entities/trends/ui';
import { ArticleList } from '@/entities/articles/ui';
import { Fragment, useEffect, useState } from 'react';
import { useTrend } from '@/entities/trends/container/TrendsContainer';
import { HomeInitData } from '../model';

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
          <Keyword />
          <KeywordScroll trends={trends} onClick={setTrend} />
          {initialArticles.length > 0 && <ArticleList trends={trends} initialArticles={initialArticles} />}
        </Fragment>
      ) : (
        <SearchPost initPosts={initialPosts} initPostsTotalCnt={initialPosts.length} />
      )}
    </div>
  );
};
