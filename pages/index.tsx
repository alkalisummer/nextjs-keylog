/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { replaceSymbol, timeAgoFormat } from '../utils/CommonUtils';
import DailyTrends from '@/utils/DailyTrends';
import Link from 'next/link';

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

const HomePage = () => {
  const [keyArr, setKeyArr] = useState<keyword[]>([]);
  const [baseDate, setBaseDate] = useState<string>('');
  const [articles, setArticles] = useState<article[]>([]);

  useEffect(() => {
    getDailyTrends();
  }, []);

  const getDailyTrends = async () => {
    await DailyTrends().then((res) => {
      //인기순으로 내림차순
      const sortByValue = res.keyArr.sort((a, b) => b.value - a.value);
      setKeyArr(sortByValue);
      setBaseDate(res.baseDate);
    });
  };

  const setKeywordArticles = async (articles: article[]) => {
    //이미지가 없는 기사는 제거
    const existImgArr = articles.filter((article) => article.image);
    setArticles(existImgArr);
  };

  return (
    <div className='index_div'>
      <div className='index_header_div'>
        <span className='nav_logo_btn'>keylog</span>
        <Navbar></Navbar>
      </div>
      <div className='index_main_div'>
        <span className='index_main_title' onClick={() => getDailyTrends()}>{`#keyword`}</span>
        <div className='index_main_keyword_div'>
          {keyArr.map((keyword, idx) => (
            <span key={idx} className='index_main_keyword' onClick={() => setKeywordArticles(keyword.articles)}>{`#${keyword.name}`}</span>
          ))}
        </div>
        {articles.length > 0 ? (
          <div className='index_article_div'>
            {articles.map((article, idx) => (
              <Link key={idx} href={article.url} target='_blank'>
                <div className='index_article'>
                  <img className='index_article_img' src={article.image.imageUrl} alt='articleImg'></img>
                  <div className='index_article_info'>
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
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default HomePage;
