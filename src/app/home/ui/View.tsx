'use client';

import { useEffect } from 'react';
import css from './view.module.scss';
import { Keyword } from '@/entities/trends/ui';
import { HomeTabs } from './homeTabs/HomeTabs';
import { Trend } from '@/entities/trends/model';
import { Article } from '@/entities/articles/model';
import { KeywordScroll } from '@/entities/trends/ui';
import { ArticleList } from '@/entities/articles/ui';
import { useTrend } from '@/entities/trends/container/TrendsContainer';

export const View = ({ trends, initialArticles }: { trends: Trend[]; initialArticles: Article[] }) => {
  const { trend, setTrend } = useTrend();

  // 렌더링 중이 아닌 useEffect에서 상태 업데이트
  useEffect(() => {
    if (trends.length > 0) {
      setTrend(trends[0]);
    }
  }, [trends, setTrend]);

  return (
    <div className={css.module}>
      <HomeTabs />
      <Keyword />
      <KeywordScroll
        trends={trends}
        customSpeeds={{
          desktop: 1.0,
          mobile: 0.8,
        }}
        onClick={setTrend}
      />
      {initialArticles.length > 0 && <ArticleList trends={trends} initialArticles={initialArticles} />}
    </div>
  );
};
