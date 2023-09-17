/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { getDailyTrends } from './api/HandleKeyword';
import { GetServerSideProps } from 'next';
import { replaceSymbol, timeAgoFormat, timeFormat } from '../utils/CommonUtils';
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

const HomePage = ({ keywordArr, pubDate }: { keywordArr: keyword[]; pubDate: string }) => {
  const [keyArr, setKeyArr] = useState<keyword[]>(keywordArr);
  const [baseDate, setBaseDate] = useState<string>(pubDate);
  const [articles, setArticles] = useState<article[]>();
  const [selectKey, setSelectKey] = useState('');
  const [selectKeyValue, setSelectKeyValue] = useState(0);

  useEffect(() => {
    init(keywordArr);
  }, []);

  const init = async (keyArr: keyword[]) => {
    const initKeyword = keyArr[0].name;
    const initArticles = keyArr[0].articles;
    const initValue = keyArr[0].value;

    setSelectKey(initKeyword);
    setKeywordArticles(initArticles, initKeyword, initValue);
    setSelectKeyValue(initValue);
  };

  const getDailyTrendsKeyword = async () => {
    return await DailyTrends('ko').then((res) => {
      setKeyArr(res.keyArr);
      setBaseDate(res.baseDate);
      init(res.keyArr);

      return res.keyArr;
    });
  };

  const setKeywordArticles = async (articles: article[], keyword: string, value: number) => {
    //이미지가 없는 기사는 제거, 제목에 키워드가 없는 기사 제거
    let resultArticles = [];
    if (keyword.indexOf(' ') !== -1) {
      let keywordArr = [];
      keywordArr = keyword.replaceAll(' ', '').split('');

      for (let article of articles) {
        for (let i = 0; i < keywordArr.length; i++) {
          if (article.title.indexOf(keywordArr[i]) === -1) {
            break;
          }
          if (i === keywordArr.length - 1) {
            resultArticles.push(article);
          }
        }
      }
    } else {
      resultArticles = articles.filter((article: article) => article.title.indexOf(keyword) !== -1);
    }
    setArticles(resultArticles);
    setSelectKey(keyword);
    setSelectKeyValue(value);
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
      <div className='index_main_div'>
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
            <span key={idx} id={keyword.name} className='index_main_keyword' onClick={() => setKeywordArticles(keyword.articles, keyword.name, keyword.value)}>{`#${keyword.name}`}</span>
          ))}
        </div>
        <div> </div>
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
