'use client';

import css from './homeTabs.module.scss';
import { useHome } from '../../container';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export const HomeTabs = () => {
  const { selectedTab, setSelectedTab } = useHome();
  const router = useRouter();

  const changeTab = (tab: string) => {
    setSelectedTab(tab);
    router.replace(`/home?tab=${tab}`);
  };

  return (
    <nav className={css.module}>
      <span
        className={`${css.tab} ${selectedTab === 'keyword' ? css.activeTab : ''}`}
        onClick={() => {
          changeTab('keyword');
        }}
      >
        <FontAwesomeIcon icon={faArrowTrendUp} className={css.ico} />
        <span className={css.text}>급상승 키워드</span>
      </span>
      <span
        className={`${css.tab} ${selectedTab === 'post' ? css.activeTab : ''}`}
        onClick={() => {
          changeTab('post');
        }}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className={css.ico} />
        <span className={css.text}>포스트</span>
      </span>
    </nav>
  );
};
