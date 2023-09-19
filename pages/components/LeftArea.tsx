/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CheckAuth from '@/utils/CheckAuth';
import { timeFormat } from '@/utils/CommonUtils';

interface user {
  id: string;
  email: string;
  image: string;
  nickname: string;
  blogName: string;
}

interface recentPost {
  POST_ID: string;
  POST_TITLE: string;
  POST_THMB_IMG_URL: string;
  RGSN_DTTM: string;
}

interface popularPost {
  POST_ID: string;
  POST_TITLE: string;
  POST_THMB_IMG_URL: string;
  RGSN_DTTM: string;
  LIKE_CNT: number;
}

interface recentComment {
  POST_ID: string;
  COMMENT_ID: string;
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
      <div className='df fd_c ai_c mb25'>
        <Link href={`/`}>
          <span className='left_area_logo_btn'>
            <i className='fa-brands fa-kickstarter mr10'></i>
          </span>
        </Link>
        <Link href={`/${userId}`}>
          <img src={userInfo.image ? userInfo.image : '/../../icon/person.png'} className='left_profile_icon' alt='profile img' />
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
      {recentPosts.length > 0 ? (
        <div className='left_area_side_div'>
          <span className='left_area_recent_title'>최근 글</span>
          {recentPosts.map((post) => (
            <div key={post.POST_ID} className='left_area_side' onClick={() => router.push(`/${userId}/posts/detail/${post.POST_ID}`)}>
              <div className='left_area_side_info'>
                <span className='left_area_side_title'>{post.POST_TITLE}</span>
                <span className='left_area_side_date'>{timeFormat(post.RGSN_DTTM)}</span>
              </div>
              {post.POST_THMB_IMG_URL ? (
                <div className='df ai_c'>
                  <img className='left_area_post_img' src={post.POST_THMB_IMG_URL} alt='postImg'></img>
                </div>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
      {popularPosts.length > 0 ? (
        <div className='left_area_side_div'>
          <span className='left_area_recent_title'>인기 글</span>
          {popularPosts.map((post) => (
            <div key={post.POST_ID} className='left_area_side' onClick={() => router.push(`/${userId}/posts/detail/${post.POST_ID}`)}>
              <div className='left_area_side_info'>
                <span className='left_area_side_title'>{post.POST_TITLE}</span>
                <span className='left_area_side_date'>{timeFormat(post.RGSN_DTTM)}</span>
              </div>
              {post.POST_THMB_IMG_URL ? (
                <div className='df ai_c'>
                  <img className='left_area_post_img' src={post.POST_THMB_IMG_URL} alt='postImg'></img>
                </div>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
      {recentComments.length > 0 ? (
        <div className='left_area_side_div'>
          <span className='left_area_recent_title'>최근 댓글</span>
          {recentComments.map((comment) => (
            <div key={comment.COMMENT_ID} className='left_area_side' onClick={() => router.push(`/${userId}/posts/detail/${comment.POST_ID}`)}>
              <div className='left_area_side_info'>
                <span className='left_area_side_title'>
                  <i className='fa-solid fa-comment-dots mr8'></i>
                  {comment.COMMENT_CNTN}
                </span>
                <span className='left_area_side_date'>{comment.USER_NICKNAME}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default React.memo(LeftArea);
