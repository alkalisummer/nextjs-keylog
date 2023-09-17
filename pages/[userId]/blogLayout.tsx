/* eslint-disable @next/next/no-sync-scripts */
/* eslint-disable @next/next/no-img-element */
import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import CheckAuth from '@/utils/CheckAuth';

interface LayoutProps {
  children: ReactNode;
  userInfo: any;
}

const BlogLayout: React.FC<LayoutProps> = ({ children, userInfo }) => {
  const router = useRouter();
  const { userId } = router.query;

  return (
    <div className='main_area'>
      <div className='left_area'>
        <Link href={`/`}>
          <span className='left_area_logo_btn'>
            <i className='fa-brands fa-kickstarter mr10'></i>
          </span>
        </Link>
        <Link href={`/${userId}`}>
          <img src={userInfo.image ? userInfo.image : '../../icon/person.png'} className='left_profile_icon' alt='profile img' />
        </Link>
        <Link href={`/${userId}`}>
          <span className='left_area_blog_name'>{userInfo.blogName}</span>
        </Link>
        <span className='left_area_title'>{userInfo.nickname}</span>
        {CheckAuth() ? (
          <div className='left_area_btn_div'>
            <Link href={`/${userId}/posts/create`}>
              <button className='create_btn'></button>
            </Link>
            <Link href={`/${userId}/chatGpt`}>
              <button className='chatgpt_btn'></button>
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className='right_area'>
        <div className='right_header pr25'>
          <Navbar></Navbar>
        </div>
        {children}
        <div className='right_footer'>
          This app is built with &nbsp;<span className='right_footer_text'>Next.js</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BlogLayout);
