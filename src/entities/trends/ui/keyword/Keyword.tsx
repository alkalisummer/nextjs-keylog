import { Trend } from '../../model';
import css from './keyword.module.scss';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface KeywordProps {
  trend: Trend;
}

export const Keyword = ({ trend }: KeywordProps) => {
  return (
    <div className={css.module}>
      <div className={css.trend}>
        <span className={css.keyword}>{`# ${trend.keyword}`}</span>
        <span className={css.traffic}>
          {trend.traffic}
          <FontAwesomeIcon icon={faArrowUp} className={css.ico} />
          <span className={css.cnt}>(검색 횟수)</span>
        </span>
      </div>
    </div>
  );
};
