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

interface hashtag {
  HASHTAG_ID: string;
  HASHTAG_NAME: string;
  HASHTAG_CNT: string;
}

const LeftArea = ({ userInfo, recentPosts, popularPosts, recentComments, hashtags }: { userInfo: user; recentPosts: recentPost[]; popularPosts: popularPost[]; recentComments: recentComment[]; hashtags: hashtag[] }) => {
  const router = useRouter();
  const { userId } = router.query;
  let tagTotalCnt = 0;

  for (const tag of hashtags) {
    tagTotalCnt += parseInt(tag.HASHTAG_CNT);
  }

  return (
    <div className='left_area'>
      <div className='left_area_header'>
        <Link href={`/`}>
          <span className='left_area_logo_btn'>
            <i className='fa-brands fa-kickstarter mr10'></i>
          </span>
        </Link>
      </div>
      <div className='df fd_c ai_c mb25'>
        <Link href={`/${userId}`}>
          <img src={userInfo.image ? userInfo.image : '/../../icon/person.png'} className='left_profile_icon' alt='profile img' />
        </Link>
        <Link href={`/${userId}`}>
          <span className='left_area_blog_name'>{userInfo.blogName}</span>
        </Link>
        <span className='left_area_title'>{userInfo.nickname}</span>
        {CheckAuth() ? (
          <div className='left_area_btn_div'>
            <Link href={`/write?keyword=true`}>
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
      <div className='left_area_side_div'>
        <span className='left_area_recent_title'>최근 글</span>
        {recentPosts.map((post) => (
          <div key={post.POST_ID} className='left_area_side' onClick={() => router.push(`/${userId}/posts/${post.POST_ID}`)}>
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
      <div className='left_area_side_div'>
        <span className='left_area_recent_title'>인기 글</span>
        {popularPosts.map((post) => (
          <div key={post.POST_ID} className='left_area_side' onClick={() => router.push(`/${userId}/posts/${post.POST_ID}`)}>
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
      <div className='left_area_side_div'>
        <span className='left_area_recent_title'>최근 댓글</span>
        {recentComments.map((comment) => (
          <div key={comment.COMMENT_ID} className='left_area_side' onClick={() => router.push(`/${userId}/posts/${comment.POST_ID}`)}>
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
      <div className='left_area_side_div mb15'>
        <span className='left_area_recent_title'>태그 목록</span>
        {hashtags.length > 0 ? <span className='left_area_hashtag' onClick={() => router.push(`/${userId}`)}>{`전체(${tagTotalCnt})`}</span> : <></>}

        {hashtags.map((tag) => (
          <span key={tag.HASHTAG_ID} className='left_area_hashtag' onClick={() => router.push(`/${userId}?tagId=${tag.HASHTAG_ID}`)}>
            {`${tag.HASHTAG_NAME}(${tag.HASHTAG_CNT})`}
          </span>
        ))}
      </div>
    </div>
  );
};
export default LeftArea;
