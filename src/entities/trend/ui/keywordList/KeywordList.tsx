'use client';

import { Trend } from '../../model';
import css from './keywordList.module.scss';
import { useTrend } from '../../container/TrendContainer';

interface KeywordListProps {
  trends: Trend[];
  setSelectedTrend: (trend: Trend) => void;
}

export const KeywordList = ({ trends, setSelectedTrend }: KeywordListProps) => {
  const { trend: selectedTrend } = useTrend();
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
