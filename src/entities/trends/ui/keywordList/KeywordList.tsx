import css from './keywordList.module.scss';
import { trend } from '../../model';

interface KeywordListProps {
  trends: trend[];
  selectedKeyword: trend;
  setSelectedKeyword: (trend: trend) => void;
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
