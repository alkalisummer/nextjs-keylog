/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as echarts from 'echarts';
import { timeFormat, replaceSymbol, timeAgoFormat } from './CommonUtils';
import Link from 'next/link';

function TrendKeyword() {
  const chartDom = useRef(null);
  const [showArticles, setShowArticles] = useState(false);
  const [linkage, setLinkage] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<seletedKey>();
  const [articles, setArticles] = useState([]);
  const [baseDate, setBaseDate] = useState('');

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

  interface seletedKey {
    name: string;
    cnt: number;
  }

  useEffect(() => {
    import('echarts-wordcloud');

    let keyArr: keyword[] = [];
    let trendKeyData: any[] = [];

    const dailyTrendsparam = { type: 'dailyTrends' };
    axios.get('/api/HandleKeyword', { params: dailyTrendsparam }).then((result) => {
      const res = JSON.parse(result.data).default.trendingSearchesDays;
      setBaseDate(`(기준일: ${timeFormat(res[res.length - 1].date)} - ${timeFormat(res[0].date)})`);
      for (let dateData of res) {
        dateData.trendingSearches.map((obj: any) => {
          //wordcloud value 사용을 위한 traffic format 간소화(ex: 200K+ -> 200)
          const trafficStr = obj.formattedTraffic;
          const reduceNum = parseInt(trafficStr.substr(0, trafficStr.length - 2));
          obj.formattedTraffic = reduceNum;
          trendKeyData.push(obj);
        });
      }

      keyArr = trendKeyData.map((obj) => ({ name: obj.title.query.replaceAll("'", ''), value: obj.formattedTraffic, articles: obj.articles }));
      if (chartDom.current) {
        let myChart = echarts.getInstanceByDom(chartDom.current);
        if (!myChart) {
          myChart = echarts.init(chartDom.current);
        }
        const chartOpt = {
          series: [
            {
              type: 'wordCloud',
              shape: 'pentagon',
              left: 0,
              top: 0,
              width: '95%',
              height: '95%',
              right: null,
              bottom: null,
              sizeRange: [20, 90],
              rotationRange: [-90, 90],
              rotationStep: 45,
              gridSize: 14,
              drawOutOfBound: false,
              shrinkToFit: true,
              layoutAnimation: true,
              textStyle: {
                fontFamily: 'Spoqa Han Sans Neo',
                fontWeight: 'bold',
                // Color can be a callback function or a color string
                color: function () {
                  // Random color
                  return 'rgb(' + [Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(',') + ')';
                },
              },
              emphasis: {
                focus: 'self',
                textStyle: {
                  textShadowBlur: 0,
                  textShadowColor: '#fffff',
                },
              },
              data: keyArr,
            },
          ],
        };
        myChart.setOption(chartOpt);
        myChart.on('click', (params) => {
          const queryParams = { type: 'relatedQueries', keyword: params.name };
          axios.get('/api/HandleKeyword', { params: queryParams }).then((result) => {
            const res = result.data;
            setLinkage(res);
          });
          setSelectedKey({ name: params.name, cnt: params.value as number });
          const articleData = JSON.parse(JSON.stringify(params.data)).articles;
          setArticles(articleData.filter((obj: any) => obj.image));
          if (!showArticles) {
            setShowArticles(true);
          }
        });
      }
    });
  }, []);

  return (
    <div>
      <div className='post_daily_keyword_div'>
        <span className='post_daily_keyword_title'>Daily Keyword</span>
        <span className='post_base_date'>{baseDate}</span>
      </div>
      <div className='post_wordcloud_div'>
        <div
          id='wordcloud'
          ref={chartDom}
          style={{ width: '50%', height: '400px' }}></div>
        <div className='post_linkage_div'>
          <span className='post_linkage_title'>연관 검색어</span>
          <div className='post_linkage_tag_div'>
            {linkage.map((obj, idx) => {
              return (
                <span
                  key={idx}
                  className='post_linkage_tag'>
                  {obj}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div className='post_articles_div'>
        <div className='post_articles_title_div'>
          <span className='post_articles_title'>Articles</span>
          <button
            className='post_articles_fold_btn'
            onClick={() => setShowArticles(!showArticles)}>
            {showArticles ? '접기 ▲' : '펼치기 ▼'}
          </button>
        </div>
        {showArticles ? (
          <div className='post_articles'>
            {selectedKey ? (
              <div className='post_selected_div'>
                <span className='post_selected_key'>{selectedKey.name}</span>
                <span className='post_selected_cnt'>{`(검색 횟수: ${selectedKey.cnt}K+)`}</span>
              </div>
            ) : (
              ''
            )}
            {articles.map((article: article, idx: number) => {
              return (
                <div
                  className='post_article'
                  key={idx}>
                  <Link
                    href={article.url}
                    target='_blank'>
                    <div className='post_article_detail'>
                      <div className='post_article_content'>
                        <div className='post_article_content_detail'>
                          <span className='post_article_title'>{replaceSymbol(article.title)}</span>
                          <pre>{replaceSymbol(article.snippet)}</pre>
                          <div className='post_article_summary'>
                            <span>{article.source}</span>
                            <span>•{timeAgoFormat(article.timeAgo)}</span>
                          </div>
                        </div>
                      </div>
                      <div className='post_article_img'>
                        <img
                          alt='article img'
                          src={article.image.imageUrl}></img>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default TrendKeyword;
