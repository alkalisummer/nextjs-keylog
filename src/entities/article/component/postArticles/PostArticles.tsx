'use client';

import Link from 'next/link';
import { Trend } from '../../../trend/model';
import css from './postArticles.module.scss';
import { formatTraffic } from '@/entities/trend/lib';
import { useArticlesQuery } from '@/entities/article/query';

interface PostArticlesProps {
  trend: Trend;
}

export function PostArticles({ trend }: PostArticlesProps) {
  const { data: articles } = useArticlesQuery({ selectedTrend: trend });

  return (
    <div className={css.module}>
      <div className={css.selected}>
        <span className={css.keyword}>{trend.keyword}</span>
        <span className={css.traffic}>{`(${formatTraffic({ traffic: trend.traffic })}+)`}</span>
      </div>
      <div className={css.list}>
        {articles?.map(
          (article, idx) =>
            article.link && (
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
            ),
        )}
      </div>
    </div>
  );
}
