'use client';

import { Trend } from '../../model';
import css from './keywordList.module.scss';
import { useHome } from '@/app/home/container';

interface KeywordListProps {
  trends: Trend[];
  setSelectedTrend: (trend: Trend) => void;
}

export const KeywordList = ({ trends, setSelectedTrend }: KeywordListProps) => {
  const { trend: selectedTrend } = useHome();
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
