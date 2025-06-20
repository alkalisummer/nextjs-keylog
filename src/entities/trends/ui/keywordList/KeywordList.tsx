'use client';

import { Trend } from '../../model';
import css from './keywordList.module.scss';

interface KeywordListProps {
  trends: Trend[];
  selectedTrend: Trend;
  setSelectedTrend: (trend: Trend) => void;
}

export const KeywordList = ({ trends, selectedTrend, setSelectedTrend }: KeywordListProps) => {
  return (
    <div className={css.module}>
      {trends.map((trend, idx) => (
        <span
          key={idx}
          id={trend.keyword}
          className={`${css.keyword} ${trend.keyword === selectedTrend.keyword ? css.highlight : ''}`}
          onClick={() => setSelectedTrend(trend)}
        >{`#${trend.keyword}`}</span>
      ))}
    </div>
  );
};
