/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { getDailyTrends } from './api/HandleKeyword';
import { GetServerSideProps } from 'next';
import { replaceSymbol, timeAgoFormat, timeFormat } from '../utils/CommonUtils';
import DailyTrends from '@/utils/DailyTrends';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

interface keyword {
  name: string;
  value: number;
  articles: [];
}

interface article {
  image: {
    imageUrl: string;
    newsUrl: string;
    source: string;
  };
  snippet: string;
  source: string;
  timeAgo: string;
  title: string;
  url: string;
}

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
}

const HomePage = ({ keywordArr, pubDate }: { keywordArr: keyword[]; pubDate: string }) => {
  const [keyArr, setKeyArr] = useState<keyword[]>(keywordArr);
  const [baseDate, setBaseDate] = useState<string>(pubDate);
  const [articles, setArticles] = useState<article[]>();
  const [selectKey, setSelectKey] = useState('');
  const [selectKeyValue, setSelectKeyValue] = useState(0);
  const [currTab, setCurrTab] = useState('keyword');
  const [searchWord, setSearchWord] = useState('');
  const [currPageNum, setCurrPageNum] = useState(1);
  const [posts, setPosts] = useState<post[]>([]);
  const router = useRouter();

  const init = async (keyArr: keyword[]) => {
    const initKeyword = keyArr[0].name;
    const initArticles = keyArr[0].articles;
    const initValue = keyArr[0].value;

    setSelectKey(initKeyword);
    setKeywordArticles(initArticles, initKeyword, initValue);
    setSelectKeyValue(initValue);
  };

  useEffect(() => {
    if (currTab === 'keyword') {
      init(keywordArr);
    } else {
      getPosts(1);
    }
  }, [currTab]);

  const getDailyTrendsKeyword = async () => {
    return await DailyTrends('ko').then((res) => {
      setKeyArr(res.keyArr);
      setBaseDate(res.baseDate);
      if (currTab === 'keyword') {
        init(res.keyArr);
      } else {
        setCurrTab('keyword');
      }
      return res.keyArr;
    });
  };

  const setKeywordArticles = async (articles: article[], keyword: string, value: number) => {
    //제목에 키워드가 없는 기사 필터링
    let resultArticles = [];
    let keywordArr = [];
    keywordArr = keyword.replaceAll(' ', '').split('');
    for (let article of articles) {
      for (let i = 0; i < keywordArr.length; i++) {
        if (article.title.toUpperCase().indexOf(keywordArr[i].toUpperCase()) === -1) {
          break;
        }
        if (i === keywordArr.length - 1) {
          resultArticles.push(article);
        }
      }
    }

    setArticles(resultArticles);
    setSelectKey(keyword);
    setSelectKeyValue(value);
  };

  const selectTab = async (e: HTMLElement, tabName: string) => {
    setCurrTab(tabName);
    if (tabName === 'keyword') {
      init(keyArr);
    }
  };

  const searchPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrPageNum(1);
    getPosts(1);
  };

  const getPosts = async (currPageNum: number) => {
    const params = { type: 'list', searchWord: searchWord, currPageNum: currPageNum, perPage: 10 };
    await axios.get('/api/HandlePost', { params: params }).then((res) => {
      const result = res.data.items;
      setPosts(result);
    });
  };

  return (
    <div className='index_div'>
      <div className='index_header_div'>
        <div>
          <span className='nav_logo_btn' onClick={() => getDailyTrendsKeyword()}>
            keylog
          </span>
        </div>
        <Navbar></Navbar>
      </div>
      <div className='index_main_tab'>
        <span className={`index_main_tab_text ${currTab === 'keyword' ? 'index_main_active' : ''}`} onClick={(e) => selectTab(e.currentTarget, 'keyword')}>
          <i className='fa-solid fa-arrow-trend-up mr8'></i>급상승 키워드
        </span>
        <span className={`index_main_tab_text ${currTab === 'post' ? 'index_main_active' : ''}`} onClick={(e) => selectTab(e.currentTarget, 'post')}>
          <i className='fa-solid fa-magnifying-glass mr8'></i>포스트
        </span>
      </div>
      <div className='index_main_div'>
        {currTab === 'keyword' ? (
          <>
            <div className='index_main_title_div'>
              <div className='index_main_title'>
                <span>{`# ${selectKey}`}</span>
                <span className='index_main_value'>
                  {selectKeyValue.toString().replaceAll('+', '')}
                  <i className='fa-solid fa-up-long index_main_value_ico'></i>
                </span>
              </div>
              <div className='index_main_cnt'>(검색 횟수)</div>
            </div>
            <div className='index_main_keyword_div'>
              {keyArr.map((keyword, idx) => (
                <span key={idx} id={keyword.name} className={`index_main_keyword ${keyword.name === selectKey ? 'index_highlight' : ''}`} onClick={() => setKeywordArticles(keyword.articles, keyword.name, keyword.value)}>{`#${keyword.name}`}</span>
              ))}
            </div>
            {articles && articles.length > 0 ? (
              <>
                <div className='w100 df jc_e mb10'>
                  <span className='index_article_date'>{baseDate}</span>
                </div>
                <div className='index_article_div'>
                  {articles.map((article, idx) => (
                    <Link key={idx} href={article.url} target='_blank'>
                      <div className='index_article'>
                        {article.image ? <img className='index_article_img' src={article.image.imageUrl} alt='articleImg'></img> : <></>}
                        <div className={`index_article_info ${article.image ? '' : 'btlr bblr'}`}>
                          <span className='index_article_title'>{replaceSymbol(article.title)}</span>
                          <span className='index_article_desc'>{replaceSymbol(article.snippet)}</span>
                          <div className='index_article_bottom'>
                            <span className='index_article_comp'>{article.source}</span>•<span className='index_article_time'>{timeAgoFormat(article.timeAgo)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <div className='index_main_title_div'>
            <form className='index_search_input_div' onSubmit={searchPost}>
              <span className='index_search_input pr5 fw_500'>#</span>
              <input className='index_search_input w40' type='text' placeholder='검색어를 입력하세요' value={searchWord} onChange={(e) => setSearchWord(e.target.value)}></input>
              <div>
                <button className='index_search_btn' type='submit'>
                  <i className='fa-solid fa-magnifying-glass'></i>
                </button>
              </div>
            </form>
            <div className='index_search_post_div'>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.POST_ID} className='index_search_post' onClick={() => router.push(`/${post.RGSR_ID}/posts/detail/${post.POST_ID}`)}>
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
                          <span className='index_search_post_bottom'>{timeFormat(post.RGSN_DTTM)}•</span>
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
                ))
              ) : (
                <div>
                  <span>검색 결과가 없습니다.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await getDailyTrends('ko');
  const resArr = JSON.parse(result).default.trendingSearchesDays;
  const pubDate = `(인기 급상승 검색어 기준일: ${timeFormat(resArr[resArr.length - 1].date)} - ${timeFormat(resArr[0].date)})`;
  let trendKeyData: any[] = [];
  for (let dateData of resArr) {
    dateData.trendingSearches.map((obj: any) => {
      trendKeyData.push(obj);
    });
  }

  const keyArr = trendKeyData.map((obj) => ({ name: obj.title.query.replaceAll("'", ''), value: obj.formattedTraffic, articles: obj.articles }));

  return {
    props: {
      keywordArr: keyArr,
      pubDate: pubDate,
    },
  };
};

export default HomePage;
