'use client';

import css from './keyword.module.scss';
import { formatTraffic } from '../../lib';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHome } from '@/app/home/container';

export const Keyword = () => {
  const { trend } = useHome();
  return (
    <section className={css.module}>
      <div className={css.trend}>
        <span className={css.keyword}>{`# ${trend?.keyword}`}</span>
        <span className={css.traffic}>
          {`${formatTraffic({ traffic: trend?.traffic || '' })}`}
          <FontAwesomeIcon icon={faArrowUp} className={css.ico} />
          <span className={css.cnt}>(검색량)</span>
        </span>
      </div>
    </section>
  );
};
