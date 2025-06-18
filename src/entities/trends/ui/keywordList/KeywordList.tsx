import css from './keywordList.module.scss';
import { Trend } from '../../model';

interface KeywordListProps {
  trends: Trend[];
  selectedKeyword: Trend;
  setSelectedKeyword: (trend: Trend) => void;
}

export const KeywordList = ({ trends, selectedKeyword, setSelectedKeyword }: KeywordListProps) => {
  return (
    <div className={css.module}>
      {trends.map((trend, idx) => (
        <span
          key={idx}
          id={trend.keyword}
          className={`${css.keyword} ${trend.keyword === selectedKeyword.keyword ? css.highlight : ''}`}
          onClick={() => setSelectedKeyword(trend)}
        >{`#${trend.keyword}`}</span>
      ))}
    </div>
  );
};
