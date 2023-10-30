/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { timeFormat } from '../utils/CommonUtils';
import axios from 'axios';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { handleMySql as handlePost } from './api/HandlePost';

//게시물 검색 무한 스크롤
import { useInView } from 'react-intersection-observer';
import IndexLayout from '../components/IndexLayout';

interface post {
  POST_ID: string;
  POST_TITLE: string;
  POST_THMB_IMG_URL: string;
  POST_CNTN: string;
  RGSR_ID: string;
  USER_NICKNAME: string;
  USER_THMB_IMG_URL: string;
  COMMENT_CNT: string;
  LIKE_CNT: string;
  RGSN_DTTM: string;
  TOTAL_ITEMS: string;
}

const HomePage = ({ initPosts, initTotalCnt }: { initPosts: post[]; initTotalCnt: number }) => {
  const [searchWord, setSearchWord] = useState('');
  const [posts, setPosts] = useState<post[]>(initPosts);

  // 게시물 무한 스크롤
  const [ref, inView] = useInView();
  const [postLoading, setPostLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [totalCnt, setTotalCnt] = useState(initTotalCnt);
  const [showCnt, setShowCnt] = useState(false);
  const [initYn, setInitYn] = useState(true);

  const router = useRouter();
  const { tagId, tagName } = router.query;

  useEffect(() => {
    if (inView && !postLoading) {
      setPageNum((prev) => prev + 1);
    }
  }, [inView]);

  useEffect(() => {
    if (!initYn) {
      getPosts();
    } else {
      setInitYn(false);
    }
  }, [pageNum]);

  const searchPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPageNum(1);
    getPosts();
  };

  const getPosts = async () => {
    setPostLoading(true);
    const params = { type: 'list', searchWord: searchWord, currPageNum: pageNum, perPage: 10, tempYn: 'N', tagId: tagId };

    if (searchWord.replaceAll(' ', '').length > 0) {
      setShowCnt(true);
    } else {
      setShowCnt(false);
    }

    await axios.get('/api/HandlePost', { params: params }).then((res) => {
      const result = res.data.items;
      if (pageNum === 1) {
        setPosts(result);
        setTotalCnt(res.data.totalItems);
      } else {
        setPosts((prev) => [...prev, ...result]);
      }
    });

    setPostLoading(false);
  };

  return (
    <IndexLayout tabName='post'>
      <div className='index_main_div'>
        <div className='index_main_title_div'>
          <form className='index_search_input_div' onSubmit={searchPost}>
            {tagName ? (
              <div className='index_search_tag_div'>
                <span className='index_search_tag_name'>{`# ${tagName}`}</span>
                <div className='index_search_cnt_txt'>
                  <span>
                    총 <span className='index_search_cnt'>{totalCnt}</span>개의 포스트
                  </span>
                </div>
              </div>
            ) : (
              <>
                <input className='index_search_input w40' type='text' placeholder='검색어를 입력하세요' value={searchWord} onChange={(e) => setSearchWord(e.target.value)}></input>
                <button className='index_search_btn' type='submit'>
                  <i className='fa-solid fa-magnifying-glass'></i>
                </button>
              </>
            )}
          </form>
          <div className='index_search_cnt_txt index_search_responsive'>
            {showCnt ? (
              <span>
                총 <span className='index_search_cnt'>{totalCnt}</span>개의 포스트를 찾았습니다.
              </span>
            ) : (
              <></>
            )}
          </div>
          {posts.length > 0 ? (
            <div className='index_search_post_div'>
              {posts.map((post, idx) => (
                <div key={post.POST_ID} ref={posts.length - 1 === idx ? ref : null} className='index_search_post' onClick={() => router.push(`/${post.RGSR_ID}/posts/${post.POST_ID}`)}>
                  <div className='index_search_post_summary'>
                    {post.POST_THMB_IMG_URL ? (
                      <div className='index_search_post_img_div'>
                        <img className='index_search_post_img' src={post.POST_THMB_IMG_URL} alt='postImg'></img>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className='index_search_post_title_cntn'>
                      <span className='index_search_post_title'>{post.POST_TITLE}</span>
                      <p className='index_search_post_cntn'>{post.POST_CNTN}</p>
                      <div>
                        <span className='index_search_post_bottom'>{timeFormat(post.RGSN_DTTM)}&nbsp;•&nbsp;</span>
                        <span className='index_search_post_bottom'>{`${post.COMMENT_CNT}개의 댓글`}</span>
                      </div>
                    </div>
                  </div>
                  <div className='index_search_post_author'>
                    <div className='df ai_c'>
                      <img className='index_search_user_img' src={post.USER_THMB_IMG_URL ? post.USER_THMB_IMG_URL : '/../../icon/person.png'} alt='userImg'></img>
                      <span className='index_search_user_text'>by</span>
                      <span className='index_search_nickname'>{post.USER_NICKNAME}</span>
                    </div>
                    <span className='index_like_text'>
                      <i className='fa-solid fa-heart mr10'></i>
                      {post.LIKE_CNT}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='df jc_c ai_c'>
              <span>검색 결과가 없습니다.</span>
            </div>
          )}
        </div>
      </div>
    </IndexLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let initPosts: post[] = [];
  let initTotalCnt = 0;
  const tagId = context.query.tagId;
  const params = { type: 'list', searchWord: '', currPageNum: 1, perPage: 10, tempYn: 'N', tagId: tagId };

  await handlePost(params).then((res) => {
    initPosts = JSON.parse(JSON.stringify(res.items));
    initTotalCnt = res.totalItems;
  });

  return {
    props: {
      initPosts,
      initTotalCnt,
    },
  };
};

export default HomePage;
