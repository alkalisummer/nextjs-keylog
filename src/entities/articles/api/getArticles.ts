import { Article, ArticleKey } from '../model';
import { createArticles } from '../lib';
import GoogleTrendsApi from '@alkalisummer/google-trends-js';

interface GetArticlesProps {
  articleKeys: ArticleKey[];
  articleCount: number;
}

export const getArticles = async ({ articleKeys, articleCount }: GetArticlesProps): Promise<Article[]> => {
  const result = await GoogleTrendsApi.trendingArticles({ articleKeys, articleCount });
  return createArticles(result);
};
