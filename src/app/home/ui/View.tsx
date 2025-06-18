'use client';

import { Trend } from '@/entities/trends/model';
import { Article } from '@/entities/articles/model';
import { Keyword, KeywordList } from '@/entities/trends/ui';
import { ArticleList } from '@/entities/articles/ui';
import { useState } from 'react';

export const View = ({ trends, articles }: { trends: Trend[]; articles: Article[] }) => {
  const [selectedKeyword, setSelectedKeyword] = useState<Trend>(trends[0]);
  return (
    <div>
      <Keyword trend={selectedKeyword} />
      <KeywordList trends={trends} selectedKeyword={selectedKeyword} setSelectedKeyword={setSelectedKeyword} />
      {articles.length > 0 && <ArticleList articles={articles} />}
    </div>
  );
};
