'use server';

import { createArticles } from '../../lib';
import { Article, ArticleKey } from '../../model';
import GoogleTrendsApi from '@alkalisummer/google-trends-js';

interface GetArticlesProps {
  articleKeys: ArticleKey[];
  articleCount: number;
}

export const getArticlesServer = async ({ articleKeys, articleCount }: GetArticlesProps): Promise<Article[]> => {
  const result = await GoogleTrendsApi.trendingArticles({ articleKeys, articleCount });
  return result?.data && result.data.length > 0 ? createArticles(result.data) : [];
};
