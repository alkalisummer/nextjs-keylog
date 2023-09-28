import React from 'react';
import Navbar from './Navbar';
import { useRouter } from 'next/router';

const RigthArea = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <div className='right_area'>
      <div className='right_header pr25'>
        <div className={`post_header ${router.pathname === '/[userId]' ? '' : 'dn'}`} onClick={() => router.push('/')}>
          <span className='left_area_logo_btn pt0'>
            <i className='fa-brands fa-kickstarter mr10'></i>
          </span>
        </div>
        <div className={`post_header ${['/[userId]/posts/[id]', '/[userId]/write'].indexOf(router.pathname) !== -1 ? '' : 'dn'}`}>
          <span className='post_back_arrow' onClick={() => router.back()}>
            &lt;
          </span>
        </div>
        <Navbar></Navbar>
      </div>
      {children}
      <div className='right_footer'>
        This app is built with &nbsp;<span className='right_footer_text'>Next.js</span>
      </div>
    </div>
  );
};

export default RigthArea;
