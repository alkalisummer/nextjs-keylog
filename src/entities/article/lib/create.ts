import { Article } from '../model';
import { formatTimeAgo } from './transform';

export const createArticles = (articles: Article[]) => {
  return articles.map(
    article =>
      <Article>{
        title: article.title,
        link: article.link,
        mediaCompany: article.mediaCompany,
        pressDate: article.pressDate,
        formattedPressDate: formatTimeAgo(article.pressDate),
        image: article.image,
      },
  );
};
