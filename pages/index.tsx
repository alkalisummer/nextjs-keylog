/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import IndexLayout from '../components/IndexLayout';
import { getDailyTrends, getGoogleArticles } from './api/HandleKeyword';
import { GetServerSideProps } from 'next';
import { removeHtml, timeAgoFormat, currentDate } from '../utils/CommonUtils';
import Link from 'next/link';

interface trend {
  title: string;
  traffic: string;
  trafficGrowthRate: string;
  activeTime: string;
  relatedKeywords: string[];
  articleKeys: articleKey[];
}

interface articleKey {
  keyNum: number;
  lang: string;
  geo: string;
}

interface article {
  title: string;
  link: string;
  mediaCompany: string;
  pressDate: number;
  image: string;
}

const HomePage = ({
  trends,
  pubDate,
  firstTrendKeywordArticles,
}: {
  trends: trend[];
  pubDate: string;
  firstTrendKeywordArticles: article[];
}) => {
  const [keyArr, setKeyArr] = useState<trend[]>(trends);
  const [baseDate, setBaseDate] = useState<string>(pubDate);
  const [articles, setArticles] = useState<article[]>(firstTrendKeywordArticles);
  const [selectKey, setSelectKey] = useState(trends[0].title);
  const [selectKeyValue, setSelectKeyValue] = useState(trends[0].traffic);
  debugger;
  return (
    <IndexLayout tabName="keyword">
      <div className="index_main_div">
        <div className="index_main_title_div">
          <div className="index_main_title">
            <span className="mr30">{`# ${selectKey}`}</span>
            <span className="index_main_value">
              {selectKeyValue.toString().replaceAll('+', '')}
              <i className="fa-solid fa-up-long index_main_value_ico"></i>
              <span className="index_main_cnt">(검색 횟수)</span>
            </span>
          </div>
        </div>
        <div className="index_main_keyword_div">
          {keyArr.map((keyword, idx) => (
            <span
              key={idx}
              id={keyword.title}
              className={`index_main_keyword ${keyword.title === selectKey ? 'index_highlight' : ''}`}
              // onClick={() => setKeywordArticles(keyword.articles, keyword.name, keyword.value)}
            >{`#${keyword.title}`}</span>
          ))}
        </div>
        {articles && articles.length > 0 ? (
          <>
            <div className="w100 df jc_e mb10">
              <span className="index_article_date">{baseDate}</span>
            </div>
            <div className="index_article_div">
              {articles.map((article, idx) => (
                <Link key={idx} href={article.link} target="_blank">
                  <div className="index_article">
                    {article.image ? (
                      <img className="index_article_img" src={article.image} alt="articleImg"></img>
                    ) : (
                      <></>
                    )}
                    <div className={`index_article_info ${article.image ? '' : 'btlr bblr'}`}>
                      <span className="index_article_title">{removeHtml(article.title)}</span>
                      <div className="index_article_bottom">
                        <span className="index_article_comp">{article.mediaCompany}</span>•
                        <span className="index_article_time">{timeAgoFormat(article.pressDate)}</span>
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

export const getServerSideProps: GetServerSideProps = async context => {
  const result = await getDailyTrends('ko');
  const trends = result.data;
  const pubDate = `(인기 급상승 검색어 기준일: ${currentDate()})`;

  // 검색 횟수 내림차순 정렬
  trends.sort((a: trend, b: trend) => Number(b.traffic) - Number(a.traffic));

  const firstTrendKeywordInfo = trends[0];
  const firstTrendKeywordArticles = await getGoogleArticles(firstTrendKeywordInfo.articleKeys, 10);
  return {
    props: {
      trends,
      pubDate,
      firstTrendKeywordArticles,
    },
  };
};

export default HomePage;
