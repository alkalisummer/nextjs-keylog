import { client } from '@/shared/lib/client';
import { Article, ArticleKey } from '../../model';

interface GetArticlesProps {
  articleKeys: ArticleKey[];
  articleCount: number;
}

export const getArticlesClient = async ({ articleKeys, articleCount }: GetArticlesProps) => {
  const result = await client.route().post<Article[]>({
    endpoint: '/article/articleList',
    options: {
      body: {
        articleKeys,
        articleCount,
      },
    },
  });

  return result.data;
};
