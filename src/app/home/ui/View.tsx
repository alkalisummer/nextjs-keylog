'use client';

import css from './view.module.scss';
import { Keyword } from '@/entities/trends/ui';
import { HomeTabs } from './homeTabs/HomeTabs';
import { Trend } from '@/entities/trends/model';
import { SearchPost } from '@/entities/posts/ui';
import { Article } from '@/entities/articles/model';
import { KeywordScroll } from '@/entities/trends/ui';
import { ArticleList } from '@/entities/articles/ui';
import { Fragment, useEffect, useState } from 'react';
import { useTrend } from '@/entities/trends/container/TrendsContainer';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';

export const View = ({ trends, initialArticles }: { trends: Trend[]; initialArticles: Article[] }) => {
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
        <SearchPost initPosts={[]} initPostsTotalCnt={0} />
      )}
    </div>
  );
};
