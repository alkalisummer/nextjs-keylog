'use client';

import { useEffect, useState } from 'react';
import css from './postArticles.module.scss';
import { Article } from '@/entities/article/model';
import { getArticlesClient } from '@/entities/article/api';
import Link from 'next/link';
import { Trend } from '../../model';

interface PostArticlesProps {
  trend?: Trend | null;
  articleCount?: number;
}

export function PostArticles({ trend, articleCount = 6 }: PostArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    let ignore = false;
    const fetchArticles = async () => {
      if (!trend) {
        setArticles([]);
        return;
      }
      const data = await getArticlesClient({ articleKeys: trend.articleKeys, articleCount });
      if (!ignore) setArticles(data || []);
    };
    fetchArticles();
    return () => {
      ignore = true;
    };
  }, [trend, articleCount]);

  if (!trend) return null;

  return (
    <div className={css.module}>
      <div className={css.header}>
        <span className={css.title}>Articles</span>
        <div className={css.selected}>
          <span className={css.keyword}>{trend.keyword}</span>
          <span className={css.traffic}>{`(${trend.traffic}+)`}</span>
        </div>
      </div>
      <div className={css.list}>
        {articles.map((a, idx) => (
          <Link key={idx} href={a.link} target="_blank" className={css.item}>
            <div className={css.image} style={{ backgroundImage: `url(${a.image})` }} />
            <div className={css.content}>
              <div className={css.titleText}>{a.title}</div>
              <div className={css.meta}>
                <span>{a.mediaCompany}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
