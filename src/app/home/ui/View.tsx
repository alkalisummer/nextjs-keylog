'use client';

import { useState } from 'react';
import { Trend } from '@/entities/trends/model';
import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/app/provider/query/lib';
import { Article } from '@/entities/articles/model';
import { ArticleList } from '@/entities/articles/ui';
import { getArticles } from '@/entities/articles/api';
import { Keyword, KeywordList } from '@/entities/trends/ui';

export const View = ({ trends, initialArticles }: { trends: Trend[]; initialArticles: Article[] }) => {
  const [selectedKeyword, setSelectedKeyword] = useState<Trend>(trends[0]);

  const { data: articles = [] } = useQuery({
    queryKey: queryKey().article().articleList(selectedKeyword.keyword),
    queryFn: () => getArticles({ articleKeys: selectedKeyword.articleKeys, articleCount: 9 }),
    initialData: selectedKeyword.keyword === trends[0].keyword ? initialArticles : undefined,
  });

  return (
    <div>
      <Keyword trend={selectedKeyword} />
      <KeywordList trends={trends} selectedKeyword={selectedKeyword} setSelectedKeyword={setSelectedKeyword} />
      {articles.length > 0 && <ArticleList articles={articles} />}
    </div>
  );
};
