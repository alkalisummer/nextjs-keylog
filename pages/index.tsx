/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import IndexLayout from '../components/IndexLayout';
import { getDailyTrends, getGoogleArticles } from './api/HandleKeyword';
import { GetServerSideProps } from 'next';
import { removeHtml, timeAgoFormat, formatCurrentDate, formatTraffic } from '../utils/CommonUtils';
import Link from 'next/link';

interface trend {
  keyword: string;
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
  pressDate: number[];
  image: string;
}

const HomePage = ({
  trends,
  baseDate,
  firstTrendKeywordArticles,
}: {
  trends: trend[];
  baseDate: string;
  firstTrendKeywordArticles: article[];
}) => {
  const [trendKeywords, setTrendKeywords] = useState<trend[]>(trends);
  const [articles, setArticles] = useState<article[]>(firstTrendKeywordArticles);
  const [selectedKeyword, setSelectedKeyword] = useState(trends[0]);

  // useEffect(() => {
  //   (async () => {
  //     debugger;
  //     const trendArticles = await getGoogleArticles(selectedKeyword.articleKeys, 9);
  //     setArticles(trendArticles);
  //   })();
  // }, [selectedKeyword]);

  return (
    <IndexLayout tabName="keyword">
      <div className="index_main_div">
        <div className="index_main_title_div">
          <div className="index_main_title">
            <span className="mr30">{`# ${selectedKeyword.keyword}`}</span>
            <span className="index_main_value">
              {formatTraffic(selectedKeyword.traffic)}
              <i className="fa-solid fa-up-long index_main_value_ico"></i>
              <span className="index_main_cnt">(검색 횟수)</span>
            </span>
          </div>
        </div>
        <div className="index_main_keyword_div">
          {trendKeywords.map((trendKeyword, idx) => (
            <span
              key={idx}
              id={trendKeyword.keyword}
              className={`index_main_keyword ${
                trendKeyword.keyword === selectedKeyword.keyword ? 'index_highlight' : ''
              }`}
              onClick={() => setSelectedKeyword(trendKeyword)}
            >{`#${trendKeyword.keyword}`}</span>
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
  const baseDate = `(인기 급상승 검색어 기준일: ${formatCurrentDate()})`;
  // 검색 횟수 내림차순 정렬
  trends.sort((a: trend, b: trend) => Number(b.traffic) - Number(a.traffic));

  const firstTrendKeywordInfo = trends[0];
  const firstTrendKeywordArticles = (await getGoogleArticles(firstTrendKeywordInfo.articleKeys, 9)).data;
  return {
    props: {
      trends,
      baseDate,
      firstTrendKeywordArticles,
    },
  };
};

export default HomePage;
