'use client';

import css from './homeTabs.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export const HomeTabs = () => {
  const pathname = usePathname();
  const isKeywordActive = pathname === '/home';
  const isPostActive = pathname === '/home/searchPosts';

  return (
    <nav className={css.module}>
      <Link href="/home" className={`${css.tab} ${isKeywordActive ? css.activeTab : ''}`}>
        <FontAwesomeIcon icon={faArrowTrendUp} className={css.ico} />
        <span className={css.text}>급상승 키워드</span>
      </Link>
      <Link href="/home/searchPosts" className={`${css.tab} ${isPostActive ? css.activeTab : ''}`}>
        <FontAwesomeIcon icon={faMagnifyingGlass} className={css.ico} />
        <span className={css.text}>포스트</span>
      </Link>
    </nav>
  );
};
