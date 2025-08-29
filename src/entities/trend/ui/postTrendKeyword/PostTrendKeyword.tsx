'use client';

import Link from 'next/link';
import { Trend } from '../../model';
import css from './postTrendKeyword.module.scss';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatTraffic, createSearchGoogleKeyword } from '../../lib';

interface PostTrendKeywordProps {
  trends: Trend[];
  selectedKeyword?: string;
  onSelect: (trend: Trend) => void;
}

export function PostTrendKeyword({ trends, selectedKeyword, onSelect }: PostTrendKeywordProps) {
  const selectedTrend = trends.find(trend => trend.keyword === selectedKeyword);
  const relatedKeywords = selectedTrend?.relatedKeywords.filter(keyword => keyword !== selectedKeyword);

  return (
    <div className={css.module}>
      <div className={css.keywordList}>
        {trends.map((trend, index) => (
          <div
            key={trend.keyword}
            className={`${css.keywordItem} ${selectedKeyword === trend.keyword ? css.active : ''}`}
            onClick={() => onSelect(trend)}
          >
            <span className={css.rank}>{index + 1}</span>
            <span className={css.keyword}>{trend.keyword}</span>
            <span className={css.traffic}>
              {formatTraffic({ traffic: trend.traffic })}
              <FontAwesomeIcon icon={faArrowUp} className={css.icon} />
            </span>
          </div>
        ))}
      </div>
      {relatedKeywords && relatedKeywords.length > 0 && (
        <div className={css.realtedKeyword}>
          <span className={css.title}>연관 검색어</span>
          <div className={css.list}>
            {relatedKeywords?.map((keyword, index) => (
              <Link key={`${keyword}-${index}`} href={createSearchGoogleKeyword(keyword)} target="_blank">
                <span>{keyword}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
