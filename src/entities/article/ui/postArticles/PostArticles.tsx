'use client';

import Link from 'next/link';
import { Trend } from '../../../trend/model';
import css from './postArticles.module.scss';
import { Article } from '@/entities/article/model';
import { formatTraffic } from '@/entities/trend/lib';

interface PostArticlesProps {
  trend: Trend;
  articles: Article[];
}

export function PostArticles({ trend, articles }: PostArticlesProps) {
  return (
    <div className={css.module}>
      <div className={css.selected}>
        <span className={css.keyword}>{trend.keyword}</span>
        <span className={css.traffic}>{`(${formatTraffic({ traffic: trend.traffic })}+)`}</span>
      </div>
      <div className={css.list}>
        {articles.map((article, idx) => (
          <Link key={idx} href={article.link} target="_blank" className={css.item}>
            <div className={css.imageWrapper}>
              <img className={css.image} src={article.image} alt="articleImg" />
            </div>
            <div className={css.content}>
              <div className={css.titleText}>{article.title}</div>
              <div className={css.meta}>
                <span>{article.mediaCompany}</span>•<span>{article.formattedPressDate}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
