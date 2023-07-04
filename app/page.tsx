/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { timeFormat } from './utils/CommonUtils';
import '../styles/Home.css';

const HomePage = () => {
  const [currentNum, setCurrentNum] = useState(1);
  const [posts, setPosts] = useState({ totalItems: 0, items: [] });

  useEffect(() => {
    getPost({ type: 'list', perPage: 6, currPageNum: 1 }).then((res) => {
      setPosts(res.data);
    });
  }, []);

  const getPost = (param: any) => {
    return axios.get('/api/HandlePost', { params: param });
  };

  const getTotalPostsArr = () => {
    const totalPostCnt = posts.totalItems;
    const totalPageNum = totalPostCnt % 6 > 0 ? totalPostCnt / 6 + 1 : totalPostCnt / 6;
    let arr = [];

    for (let i = 1; i <= totalPageNum; i++) {
      arr.push(i);
    }

    return arr;
  };

  const handlePagination = async (pageNum: any) => {
    const selectNum = pageNum ?? null;
    if (selectNum) {
      await getPost({ type: 'list', perPage: 6, currPageNum: selectNum }).then((res) => {
        if (res.data.items && res.data.items.length > 0) {
          setPosts(res.data);
          setCurrentNum(parseInt(selectNum));
        }
      });
    }
  };

  const totalPostsArr = getTotalPostsArr();

  return (
    <div className='home_div'>
      <div className='home_header_div'>
        <span className='home_header_title'>{`kyuuun`}</span>
      </div>
      <div className='home_post'>
        <div className='home_header'>
          <span className='home_post_cnt'>{`전체 글(${posts.items.length})`}</span>
          <div className='home_header_btn'>
            <Link href={'/chatgpt'}>
              <button className='chatgpt_btn'>ChatGPT</button>
            </Link>
            <Link href={'/posts/create'}>
              <button className='create_btn'>글쓰기</button>
            </Link>
          </div>
        </div>
        {posts.items?.map((post: any) => {
          return (
            <PostItem
              key={post.POST_ID}
              post={post}
            />
          );
        })}
      </div>
      <div className='home_page_nav'>
        <span
          className='home_page_nav_prev'
          onClick={(e) => handlePagination(currentNum - 1)}>
          <span className='home_page_nav_arr'>&lt;</span> &nbsp;&nbsp;Prev
        </span>
        {totalPostsArr.map((obj: number, idx: number) => {
          return (
            <span
              key={idx}
              className={`home_page_num ${currentNum === idx + 1 ? 'home_page_slct_num' : ''}`}
              onClick={(e) => handlePagination(e.currentTarget.textContent)}>
              {obj}
            </span>
          );
        })}
        <span
          className='home_page_nav_next'
          onClick={(e) => handlePagination(currentNum + 1)}>
          Next&nbsp;&nbsp; <span className='home_page_nav_arr'>&gt;</span>
        </span>
      </div>
    </div>
  );
};

const PostItem = ({ post }: any) => {
  const { POST_ID, POST_TITLE, POST_CNTN, POST_HTML_CNTN, AMNT_DTTM } = post || {};

  //html data 에서 이미지를 추출
  const cheerio = require('cheerio');
  const htmlCntn = Buffer.from(POST_HTML_CNTN).toString();
  const $ = cheerio.load(htmlCntn);
  const imageTags = $('img');
  const thumbImageArr = imageTags.map((index: number, el: any) => $(el).attr('src')).get()[0];

  return (
    <div className='home_post_title_content'>
      <Link href={`/posts/detail/${POST_ID}`}>
        {thumbImageArr ? (
          <div className='home_post_thumb'>
            <div className='home_thumb_content'>
              <span className='home_post_title'>{POST_TITLE}</span>
              <p className='home_post_content'>{POST_CNTN ? POST_CNTN : '작성된 내용이 없습니다.'}</p>
              <span className='home_post_created'>{timeFormat(AMNT_DTTM)}</span>
            </div>
            <div className='home_thumb_img_div'>
              <img
                className='home_thumb_img'
                src={thumbImageArr}
                alt='thumbImg'
              />
            </div>
          </div>
        ) : (
          <div>
            <span className='home_post_title'>{POST_TITLE}</span>
            <p className='home_post_content'>{POST_CNTN ? POST_CNTN : '작성된 내용이 없습니다.'}</p>
            <span className='home_post_created'>{timeFormat(AMNT_DTTM)}</span>
          </div>
        )}
      </Link>
    </div>
  );
};

export default HomePage;
