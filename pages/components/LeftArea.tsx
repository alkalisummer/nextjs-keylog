/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CheckAuth from '@/utils/CheckAuth';

interface user {
  id: string;
  email: string;
  image: string;
  nickname: string;
  blogName: string;
}

interface recentPost {
  POST_TITLE: string;
  POST_THMB_IMG_URL: string;
  RGSN_DTTM: string;
}

interface popularPost {
  POST_TITLE: string;
  POST_THMB_IMG_URL: string;
  RGSN_DTTM: string;
  LIKE_CNT: number;
}

interface recentComment {
  COMMENT_CNTN: string;
  USER_NICKNAME: string;
  RGSR_ID: string;
  RGSN_DTTM: string;
}

const LeftArea = ({ userInfo, recentPosts, popularPosts, recentComments }: { userInfo: user; recentPosts: recentPost[]; popularPosts: popularPost[]; recentComments: recentComment[] }) => {
  const router = useRouter();
  const { userId } = router.query;
  return (
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
  );
};

export default React.memo(LeftArea);
