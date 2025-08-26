'use client';

import { useEffect, useRef, useState } from 'react';
import css from './trendKeywordPanel.module.scss';
import { Trend } from '../../model';
import { formatTraffic } from '../../lib';
import { faArrowUp, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface TrendKeywordPanelProps {
  trends: Trend[];
  onKeywordClick?: (keyword: string) => void;
}

export const TrendKeywordPanel = ({ trends, onKeywordClick }: TrendKeywordPanelProps) => {
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(trends[0] || null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showArticles, setShowArticles] = useState(false);

  const handleTrendSelect = (trend: Trend) => {
    setSelectedTrend(trend);
    setShowArticles(true);
  };

  const handleKeywordInsert = (keyword: string) => {
    if (onKeywordClick) {
      onKeywordClick(keyword);
    }
  };

  return (
    <div className={css.module}>
      <div className={css.header}>
        <h3 className={css.title}>실시간 트렌드 키워드</h3>
        <button className={css.toggleBtn} onClick={() => setIsExpanded(!isExpanded)}>
          <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
        </button>
      </div>

      {isExpanded && (
        <>
          <div className={css.keywordList}>
            {trends.map((trend, index) => (
              <div
                key={trend.keyword}
                className={`${css.keywordItem} ${selectedTrend?.keyword === trend.keyword ? css.active : ''}`}
                onClick={() => handleTrendSelect(trend)}
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

          {selectedTrend && showArticles && (
            <div className={css.articleSection}>
              <div className={css.sectionHeader}>
                <h4>#{selectedTrend.keyword} 관련 기사</h4>
                <button className={css.insertBtn} onClick={() => handleKeywordInsert(selectedTrend.keyword)}>
                  키워드 삽입
                </button>
              </div>

              <div className={css.articleList}>
                {selectedTrend.articles?.slice(0, 5).map((article: any, index: number) => (
                  <a
                    key={index}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={css.articleItem}
                  >
                    <h5 className={css.articleTitle}>{article.title}</h5>
                    <p className={css.articleSnippet}>{article.snippet}</p>
                    <span className={css.articleSource}>{article.source}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className={css.footer}>
            <p className={css.footerText}>구글 트렌드 기반 실시간 검색어</p>
          </div>
        </>
      )}
    </div>
  );
};
