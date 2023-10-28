import React, { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  tabName: string;
}

const IndexLayout: React.FC<LayoutProps> = ({ children, tabName }) => {
  const router = useRouter();
  const [currTab, setCurrTab] = useState(tabName);
  return (
    <div className='index_div'>
      <div className='index_header_div'>
        <div>
          <span className='nav_logo_btn' onClick={() => router.push('/')}>
            keylog
          </span>
        </div>
        <Navbar></Navbar>
      </div>
      <div className='index_main_tab'>
        <span
          className={`index_main_tab_text ${currTab === 'keyword' ? 'index_main_active' : ''}`}
          onClick={(e) => {
            router.push('/');
            setCurrTab('keyword');
          }}
        >
          <i className='fa-solid fa-arrow-trend-up mr8'></i>급상승 키워드
        </span>
        <span
          className={`index_main_tab_text ${currTab === 'post' ? 'index_main_active' : ''}`}
          onClick={(e) => {
            router.push('/search');
            setCurrTab('post');
          }}
        >
          <i className='fa-solid fa-magnifying-glass mr8'></i>포스트
        </span>
      </div>
      {children}
    </div>
  );
};

export default IndexLayout;
