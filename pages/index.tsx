/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import IndexLayout from '../components/IndexLayout';
import { getDailyTrends } from './api/HandleKeyword';
import { GetServerSideProps } from 'next';
import { removeHtml, timeAgoFormat, timeFormat, getValueToNum } from '../utils/CommonUtils';
import Link from 'next/link';

interface keyword {
  name: string;
  value: string;
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
  const [selectKeyValue, setSelectKeyValue] = useState('');

  useEffect(() => {
    //중복제거
    let removeDuplicate: keyword[] = [];
    for (let keyword of keywordArr) {
      keyword.name = keyword.name.toLowerCase();
      const index = removeDuplicate.findIndex((obj) => obj.name.toLowerCase() === keyword.name);
      if (index === -1) {
        removeDuplicate.push(keyword);
      }
    }
    // 검색횟수 내림차순 정렬
    removeDuplicate.sort((a: keyword, b: keyword) => getValueToNum(b.value) - getValueToNum(a.value));

    setKeyArr(removeDuplicate);
    setBaseDate(pubDate);
    init(removeDuplicate);
  }, [keywordArr, pubDate]);

  const init = async (keyArr: keyword[]) => {
    const initKeyword = keyArr[0].name;
    const initArticles = keyArr[0].articles;
    const initValue = keyArr[0].value;

    setSelectKey(initKeyword);
    setKeywordArticles(initArticles, initKeyword, initValue);
    setSelectKeyValue(initValue);
  };

  const setKeywordArticles = async (articles: article[], keyword: string, value: string) => {
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

  return (
    <IndexLayout tabName='keyword'>
      <div className='index_main_div'>
        <div className='index_main_title_div'>
          <div className='index_main_title'>
            <span className='mr30'>{`# ${selectKey}`}</span>
            <span className='index_main_value'>
              {selectKeyValue.toString().replaceAll('+', '')}
              <i className='fa-solid fa-up-long index_main_value_ico'></i>
              <span className='index_main_cnt'>(검색 횟수)</span>
            </span>
          </div>
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
                      <span className='index_article_title'>{removeHtml(article.title)}</span>
                      <span className='index_article_desc'>{removeHtml(article.snippet)}</span>
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
    </IndexLayout>
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
