/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as echarts from 'echarts';
import WordCloudOpt, { LineChartOpt } from './ChartOpt';
import { timeFormat, replaceSymbol, timeAgoFormat } from './CommonUtils';
import Link from 'next/link';

function TrendKeyword() {
  const wChartDom = useRef(null);
  const lChartDom = useRef(null);
  const [showArticles, setShowArticles] = useState(false);
  const [showAutoPost, setShowAutoPost] = useState(false);
  const [showLineChart, setShowLineChart] = useState(false);
  const [showAddterm, setShowAddterm] = useState(true);
  const [linkage, setLinkage] = useState<string[]>([]);

  const [lineKeyword, setLineKeyword] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');

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
      if (wChartDom.current) {
        let wordCloud = echarts.getInstanceByDom(wChartDom.current);
        if (!wordCloud) {
          wordCloud = echarts.init(wChartDom.current);
          wordCloud.setOption(WordCloudOpt(keyArr));
          wordCloud.on('click', (params) => {
            setLineKeyword([params.name]);
            const queryParams = { type: 'relatedQueries', keyword: params.name };
            axios.get('/api/HandleKeyword', { params: queryParams }).then((result) => {
              const suggestRes = result.data;
              setLinkage(suggestRes);
            });
            setSelectedKey({ name: params.name, cnt: params.value as number });
            const articleData = JSON.parse(JSON.stringify(params.data)).articles;
            setArticles(articleData.filter((obj: any) => obj.image));
            if (!showArticles) {
              setShowArticles(true);
            }
          });
        }
      }
    });
  }, []);

  useEffect(() => {
    if (lineKeyword.length > 0) {
      if (!showLineChart) {
        setShowLineChart(true);
      }
      const queryParams = { type: 'interestOverTime', keyword: lineKeyword };
      axios.post('/api/HandleKeyword', { params: queryParams }).then((result) => {
        const interestRes = JSON.parse(result.data);
        let lineChartDate: string[] = [];
        let lineChartValueArr = [];

        const randomColor = () => {
          return 'rgb(' + [Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(',') + ')';
        };

        const timeLineData = (num: number) => {
          let res = [];
          for (let data of interestRes.default.timelineData) {
            res.push(data.value[num]);
            if (lineChartDate.length !== interestRes.default.timelineData.length) {
              lineChartDate.push(data.formattedAxisTime);
            }
          }
          return res;
        };

        for (let i = 0; i < lineKeyword.length; i++) {
          lineChartValueArr.push({
            name: lineKeyword[i],
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: randomColor(),
            },
            data: timeLineData(i),
          });
        }
        if (lChartDom.current) {
          let lineChart = echarts.getInstanceByDom(lChartDom.current);
          if (!lineChart) {
            lineChart = echarts.init(lChartDom.current);
          }
          const lineChartOpt = LineChartOpt({ dateArr: lineChartDate, valueArr: lineChartValueArr, legendArr: lineKeyword });
          lineChart.setOption(lineChartOpt);
        }
      });
    }
  }, [lineKeyword]);

  const addTerm = () => {
    setShowAddterm(false);
    const parentDiv = document.querySelector('.post_line_keyword_div');
    const keywordInput = document.createElement('input');

    keywordInput.className = 'post_line_keyword';
    keywordInput.placeholder = '검색어 추가';
    keywordInput.value = newKeyword;
    keywordInput.onchange = (e: Event) => {
      setNewKeyword((e.target as HTMLInputElement).value);
    };
    keywordInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        setShowAddterm(true);
        setLineKeyword((prev) => [...prev, keywordInput.value]);
        if (keywordInput.parentNode) {
          keywordInput.parentNode.removeChild(keywordInput);
        }
        setNewKeyword('');
      }
    });
    parentDiv?.append(keywordInput);
  };

  return (
    <div>
      {/* WordCloud  */}
      <div className='post_daily_keyword_div'>
        <span className='post_daily_keyword_title'>Daily Keyword</span>
        <span className='post_base_date'>{baseDate}</span>
      </div>
      <div className='post_wordcloud_div'>
        <div
          id='wordcloud'
          ref={wChartDom}
          style={{ width: '50%', height: '400px' }}></div>
        <div className='post_linkage_div'>
          <span className='post_linkage_title'>연관 검색어</span>
          <div className='post_linkage_tag_div'>
            {linkage.map((obj, idx) => {
              return (
                <Link
                  key={idx}
                  href={`https://www.google.com/search?q=${obj}`}
                  target='_blank'>
                  <span className='post_linkage_tag'>{obj}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {/* /WordCloud  */}
      {/* Interest Over Time */}
      <div className='post_sub_div'>
        <div className='post_sub_title_div'>
          <span className='post_sub_title'>Interest Change Chart</span>
          <button
            className='post_fold_btn'
            onClick={() => setShowLineChart(!showLineChart)}>
            {showLineChart ? '접기 ▲' : '펼치기 ▼'}
          </button>
        </div>
        <div
          className='post_line_chart_div'
          style={{ display: showLineChart ? '' : 'none' }}>
          <div className='post_line_keyword_div'>
            {lineKeyword.map((obj: string, idx: number) => {
              return (
                <span
                  key={idx}
                  className='post_line_keyword'>
                  {obj}
                </span>
              );
            })}
            {lineKeyword.length !== 5 && showAddterm ? (
              <button
                id='addTerm'
                className='post_line_keyword'
                onClick={() => addTerm()}>
                + 비교 추가
              </button>
            ) : (
              ''
            )}
          </div>

          <div
            id='lineChart'
            ref={lChartDom}
            style={{ width: '100%', height: '400px' }}></div>
        </div>
      </div>
      {/* /Interest Over Time */}
      {/* Article  */}
      <div className='post_sub_div'>
        <div className='post_sub_title_div'>
          <span className='post_sub_title'>Articles</span>
          <button
            className='post_fold_btn'
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
      {/* /Article  */}
      {/* AutoPosting  */}
      <div className='post_sub_div'>
        <div className='post_sub_title_div'>
          <span className='post_sub_title'>Auto Posting</span>
          <button
            className='post_fold_btn'
            onClick={() => setShowAutoPost(!showAutoPost)}>
            {showAutoPost ? '접기 ▲' : '펼치기 ▼'}
          </button>
        </div>
        <div className='post_auto_'></div>
      </div>
      {/* /AutoPosting  */}
    </div>
  );
}

export default TrendKeyword;
