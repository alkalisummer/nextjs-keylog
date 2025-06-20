'use client';

import { useState } from 'react';
import { Trend } from '@/entities/trends/model';
import { Article } from '@/entities/articles/model';
import { ArticleList } from '@/entities/articles/ui';
import { Keyword, KeywordList } from '@/entities/trends/ui';
import { useArticlesQuery } from '@/entities/articles/query';

export const View = ({ trends, initialArticles }: { trends: Trend[]; initialArticles: Article[] }) => {
  const [selectedTrend, setSelectedTrend] = useState<Trend>(trends[0]);
  const { data: articles = [] } = useArticlesQuery({ trends, selectedTrend, initialData: initialArticles });

  return (
    <div>
      <Keyword trend={selectedTrend} />
      <KeywordList trends={trends} selectedTrend={selectedTrend} setSelectedTrend={setSelectedTrend} />
      {articles.length > 0 && <ArticleList articles={articles} />}
    </div>
  );
};
