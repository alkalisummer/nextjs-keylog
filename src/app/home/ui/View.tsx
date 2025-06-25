'use client';

import { useState } from 'react';
import { Trend } from '@/entities/trends/model';
import { Article } from '@/entities/articles/model';
import { KeywordScroll } from '@/entities/trends/ui';
import { ArticleList } from '@/entities/articles/ui';
import { Keyword, KeywordList } from '@/entities/trends/ui';
import { useArticlesQuery } from '@/entities/articles/query';

export const View = ({ trends, initialArticles }: { trends: Trend[]; initialArticles: Article[] }) => {
  const [selectedTrend, setSelectedTrend] = useState<Trend>(trends[0]);
  const { data: articles = [] } = useArticlesQuery({ trends, selectedTrend, initialData: initialArticles });
  const keywordList = <KeywordList trends={trends} selectedTrend={selectedTrend} setSelectedTrend={setSelectedTrend} />;

  return (
    <div>
      <Keyword trend={selectedTrend} />
      <KeywordScroll
        trends={trends}
        components={[keywordList]}
        customSpeeds={{
          desktop: 1.0,
          mobile: 0.8,
        }}
        onClick={setSelectedTrend}
      />
      {articles.length > 0 && <ArticleList articles={articles} />}
    </div>
  );
};
