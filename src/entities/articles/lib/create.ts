import { Article } from '../model';
import { formatTimeAgo, removeHtml } from './transform';

export const createArticles = (articles: Article[]) => {
  return articles.map(
    article =>
      <Article>{
        title: removeHtml(article.title),
        link: article.link,
        mediaCompany: article.mediaCompany,
        pressDateArr: article.pressDateArr,
        pressDate: formatTimeAgo(article.pressDateArr),
        image: article.image,
      },
  );
};
