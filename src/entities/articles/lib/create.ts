import { Article } from '../model';
import { formatTimeAgo, removeHtml } from './transform';

export const createArticles = (articles: Article[]) => {
  return articles
    .map(
      article =>
        <Article>{
          title: article.title,
          link: article.link,
          mediaCompany: article.mediaCompany,
          pressDate: article.pressDate,
          formattedPressDate: formatTimeAgo(article.pressDate),
          image: article.image,
        },
    )
    .sort((a, b) => b.pressDate[0] - a.pressDate[0]);
};
