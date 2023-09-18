import React, { ReactNode } from 'react';
import RigthArea from '../components/RigthArea';
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
    POST_TITLE: string;
    POST_THMB_IMG_URL: string;
    RGSN_DTTM: string;
  }[];
  popularPosts: {
    POST_TITLE: string;
    POST_THMB_IMG_URL: string;
    RGSN_DTTM: string;
    LIKE_CNT: number;
  }[];
  recentComments: {
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
      <RigthArea>{children}</RigthArea>
    </div>
  );
};

export default React.memo(BlogLayout);
