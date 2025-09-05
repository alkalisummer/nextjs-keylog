'use client';

import Link from 'next/link';
import Image from 'next/image';
import css from './view.module.scss';
import { formatDate } from '@/shared/lib/util';
import { useHome } from '@/app/home/container';
import { useArticlesQuery } from '../../../query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';

export const View = () => {
  const baseDate = `인기 검색어 기준일: ${formatDate({ date: new Date(), seperator: '.' })}`;
  const { trend, selectedTab } = useHome();
  const { data: articles = [] } = useArticlesQuery({ selectedTrend: trend });

  if (selectedTab === 'post') return;

  return (
    <section className={css.module}>
      <div className={css.articleDate}>
        <span>(</span>
        <Image
          className={css.logo}
          src="/icon/google.svg"
          alt="google logo"
          width={50}
          height={15}
          quality={100}
          priority
        />
        <span className={css.trends}>Trends</span>
        <FontAwesomeIcon icon={faArrowTrendUp} className={css.icon} />
        <span>{baseDate}</span>
        <span>)</span>
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
    </section>
  );
};
