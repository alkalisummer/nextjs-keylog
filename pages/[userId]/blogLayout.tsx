import React, { ReactNode } from 'react';
import RightArea from '../components/RightArea';
import LeftArea from '../components/LeftArea';

interface LayoutProps {
  children: ReactNode;
  userInfo: {
    id: string;
    email: string;
    image: string;
    nickname: string;
    blogName: string;
  };
  recentPosts: {
    POST_ID: string;
    POST_TITLE: string;
    POST_THMB_IMG_URL: string;
    RGSN_DTTM: string;
  }[];
  popularPosts: {
    POST_ID: string;
    POST_TITLE: string;
    POST_THMB_IMG_URL: string;
    RGSN_DTTM: string;
    LIKE_CNT: number;
  }[];
  recentComments: {
    POST_ID: string;
    COMMENT_ID: string;
    COMMENT_CNTN: string;
    USER_NICKNAME: string;
    RGSR_ID: string;
    RGSN_DTTM: string;
  }[];
}

const BlogLayout: React.FC<LayoutProps> = ({ children, userInfo, recentPosts, popularPosts, recentComments }) => {
  return (
    <div className='main_area'>
      <LeftArea userInfo={userInfo} recentPosts={recentPosts} popularPosts={popularPosts} recentComments={recentComments}></LeftArea>
      <RightArea>{children}</RightArea>
    </div>
  );
};

export default React.memo(BlogLayout);
