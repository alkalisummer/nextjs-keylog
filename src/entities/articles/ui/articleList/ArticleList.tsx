'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import css from './articleList.module.scss';
import { useArticlesQuery } from '../../query';
import { Trend } from '@/entities/trends/model';
import { formatFullDate } from '@/shared/lib/util';
import { Article } from '@/entities/articles/model';
import { useTrend } from '@/entities/trends/container/TrendsContainer';

interface ArticleListProps {
  trends: Trend[];
  initialArticles: Article[];
}

export const ArticleList = ({ trends, initialArticles }: ArticleListProps) => {
  const baseDate = `(인기 급상승 검색어 기준일: ${formatFullDate(new Date(), '.')})`;
  const { trend } = useTrend();
  const { data: articles = [] } = useArticlesQuery({ trends, selectedTrend: trend, initialData: initialArticles });

  return (
    <Fragment>
      <div className={css.articleDate}>
        <span>{baseDate}</span>
      </div>
      <div className={css.articleList}>
        {articles.map((article, idx) => (
          <Link key={idx} href={article.link} target="_blank">
            <div className={css.article}>
              {article.image ? <img src={article.image} alt="articleImg"></img> : <></>}
              <div className={`${css.articleInfo} ${article.image ? '' : css.noImg}`}>
                <span className={css.articleTitle}>{article.title}</span>
                <div className={css.articleBottom}>
                  <span>{article.mediaCompany}</span>•<span>{article.formattedPressDate}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Fragment>
  );
};
