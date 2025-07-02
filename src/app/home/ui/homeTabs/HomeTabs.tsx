'use client';

import css from './homeTabs.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

interface HomeTabsProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const HomeTabs = ({ currentTab, setCurrentTab }: HomeTabsProps) => {
  return (
    <div className={css.module}>
      <span
        className={`${css.tab} ${currentTab === 'keyword' ? css.activeTab : ''}`}
        onClick={e => {
          setCurrentTab('keyword');
        }}
      >
        <FontAwesomeIcon icon={faArrowTrendUp} className={css.ico} />
        <span className={css.text}>급상승 키워드</span>
      </span>
      <span
        className={`${css.tab} ${currentTab === 'post' ? css.activeTab : ''}`}
        onClick={e => {
          setCurrentTab('post');
        }}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className={css.ico} />
        <span className={css.text}>포스트</span>
      </span>
    </div>
  );
};
