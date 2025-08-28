'use client';

import { useState } from 'react';
import css from './postAssistant.module.scss';
import { Trend } from '../../model';
import { formatTraffic } from '../../lib';
import { faArrowUp, faChevronDown, faChevronUp, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PostAssistantProps {
  trends: Trend[];
}

export const PostAssistant = ({ trends }: PostAssistantProps) => {
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(trends[0] || null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showArticles, setShowArticles] = useState(false);

  const handleTrendSelect = (trend: Trend) => {
    setSelectedTrend(trend);
    setShowArticles(true);
  };

  return (
    <div className={css.module}>
      <div className={css.header}>
        <div className={css.title}>
          <h3 className={css.title}>급상승 키워드</h3>
          <FontAwesomeIcon icon={faArrowTrendUp} className={css.icon} />
        </div>
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
        </>
      )}
    </div>
  );
};
