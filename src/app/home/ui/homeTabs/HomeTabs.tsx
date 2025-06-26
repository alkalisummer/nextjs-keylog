'use client';

import { useState } from 'react';
import css from './homeTabs.module.scss';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export const HomeTabs = () => {
  const router = useRouter();
  const [currTab, setCurrTab] = useState('keyword');
  return (
    <div className={css.module}>
      <span
        className={`${css.tab} ${currTab === 'keyword' ? css.activeTab : ''}`}
        onClick={e => {
          router.push('/home');
          setCurrTab('keyword');
        }}
      >
        <FontAwesomeIcon icon={faArrowTrendUp} className={css.ico} />
        <span className={css.text}>급상승 키워드</span>
      </span>
      <span
        className={`${css.tab} ${currTab === 'postings' ? css.activeTab : ''}`}
        onClick={e => {
          router.push('/search');
          setCurrTab('post');
        }}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className={css.ico} />
        <span className={css.text}>포스트</span>
      </span>
    </div>
  );
};
