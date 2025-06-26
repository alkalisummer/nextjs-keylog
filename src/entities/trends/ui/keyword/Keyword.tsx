'use client';

import css from './keyword.module.scss';
import { formatTraffic } from '../../lib';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTrend } from '../../container/TrendsContainer';

export const Keyword = () => {
  const { trend } = useTrend();
  return (
    <div className={css.module}>
      <div className={css.trend}>
        <span className={css.keyword}>{`# ${trend?.keyword}`}</span>
        <span className={css.traffic}>
          {`${formatTraffic({ traffic: trend?.traffic || '' })}`}
          <FontAwesomeIcon icon={faArrowUp} className={css.ico} />
          <span className={css.cnt}>(검색량)</span>
        </span>
      </div>
    </div>
  );
};
