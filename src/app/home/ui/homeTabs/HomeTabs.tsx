'use client';

import css from './homeTabs.module.scss';
import { useHome } from '../../container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export const HomeTabs = () => {
  const { selectedTab, setSelectedTab } = useHome();

  return (
    <nav className={css.module}>
      <span
        className={`${css.tab} ${selectedTab === 'keyword' ? css.activeTab : ''}`}
        onClick={() => {
          setSelectedTab('keyword');
        }}
      >
        <FontAwesomeIcon icon={faArrowTrendUp} className={css.ico} />
        <span className={css.text}>급상승 키워드</span>
      </span>
      <span
        className={`${css.tab} ${selectedTab === 'post' ? css.activeTab : ''}`}
        onClick={() => {
          setSelectedTab('post');
        }}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className={css.ico} />
        <span className={css.text}>포스트</span>
      </span>
    </nav>
  );
};
