'use client';

import { useState } from 'react';
import { Trend } from '@/entities/trends/model';
import { Article } from '@/entities/articles/model';
import { ArticleList } from '@/entities/articles/ui';
import { Keyword, KeywordList } from '@/entities/trends/ui';
import { useArticlesQuery } from '@/entities/articles/query';
import { KeywordBox } from '@/entities/trends/ui';
import { KeywordScroll } from '@/entities/trends/ui';

export const View = ({ trends, initialArticles }: { trends: Trend[]; initialArticles: Article[] }) => {
  const [selectedTrend, setSelectedTrend] = useState<Trend>(trends[0]);
  const { data: articles = [] } = useArticlesQuery({ trends, selectedTrend, initialData: initialArticles });
  return (
    <div>
      <KeywordScroll trends={trends} />
      <Keyword trend={selectedTrend} />
      <KeywordBox trends={trends} />
      <KeywordList trends={trends} selectedTrend={selectedTrend} setSelectedTrend={setSelectedTrend} />
      {articles.length > 0 && <ArticleList articles={articles} />}
    </div>
  );
};
