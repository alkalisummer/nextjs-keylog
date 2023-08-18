/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { timeFormat, replaceSymbol, timeAgoFormat } from './CommonUtils';
import ArticlePrompt from './ChatGptPrompt';

//echart - wordcloud, linechart
import * as echarts from 'echarts';
import WordCloudOpt, { LineChartOpt } from './ChartOpt';

//react-tooltip
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Box, Typography } from '@material-ui/core';

//clipboard 복사
import ClipboardJS from 'clipboard';

//mui progressbar(원형)
import CircularProgress from '@material-ui/core/CircularProgress';

//mui notification
import Snackbar from '@mui/material/Snackbar';

function TrendKeyword() {
  const wChartDom = useRef(null);
  const lChartDom = useRef(null);

  const [showArticles, setShowArticles] = useState(false);
  const [showAutoPost, setShowAutoPost] = useState(false);
  const [showLineChart, setShowLineChart] = useState(false);
  const [showAddterm, setShowAddterm] = useState(true);
  const [showNoti, setShowNoti] = useState(false);

  const [linkage, setLinkage] = useState<string[]>([]);

  const [lineKeyword, setLineKeyword] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');

  const [selectedKey, setSelectedKey] = useState<seletedKey>();
  const [articles, setArticles] = useState<article[]>([]);
  const [baseDate, setBaseDate] = useState('');

  const [currTab, setCurrTab] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

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
    new ClipboardJS('#clipboard_copy_btn');
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
          //wordcloud 키워드 클릭 이벤트
          wordCloud.on('click', (params) => {
            setLineKeyword([params.name]);
            const queryParams = { type: 'relatedQueries', keyword: params.name };
            //선택한 키워드의 연관 검색어
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
            if (!showAutoPost) {
              setShowAutoPost(true);
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
          lineChart.clear();
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

  const clickTab = (tabId: string) => {
    setCurrTab(tabId);
  };

  const autoPostDaily = () => {
    setIsLoading(true);
    const articlesSummary = ArticlePrompt(articles, selectedKey!.name);
    axios.post('/api/ChatGptHandle', { type: 'auto-post', chatContent: articlesSummary, keyword: selectedKey!.name }).then((res) => {
      setIsLoading(false);
      const contentDiv = document.querySelector('.post_auto_daily_content');
      contentDiv!.innerHTML = res.data.chatGptRes.content;
    });
  };

  const clearPost = () => {
    document.querySelector('.post_auto_daily_content')!.innerHTML = '';
  };

  const openNoti = () => {
    setShowNoti(true);
  };

  const closeNoti = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNoti(false);
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
          <span className='post_sub_title'>
            Interest Change Chart
            <i
              className='fa-regular fa-circle-question tooltip'
              data-tooltip-id='line-tooltip'></i>
          </span>

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
        {showAutoPost ? (
          <div className='post_auto_div'>
            <div className='post_auto_tab'>
              <span
                className={`post_auto_tab_title ${currTab === '1' ? 'post_focus_tab' : ''}`}
                onClick={() => clickTab('1')}>
                Daily Keyword
                <i
                  className='fa-regular fa-circle-question small_tooltip'
                  data-tooltip-id='daily-tooltip'></i>
              </span>
              <span
                className={`post_auto_tab_title ${currTab === '2' ? 'post_focus_tab' : ''}`}
                onClick={() => clickTab('2')}>
                Custom Keyword
                <i
                  className='fa-regular fa-circle-question small_tooltip'
                  data-tooltip-id='custom-tooltip'></i>
              </span>
            </div>
            <div className='post_auto_tab_div'>
              {currTab === '1' && selectedKey ? (
                <div className='post_auto_daily_div'>
                  <div className='post_auto_btn_div'>
                    <div className='post_auto_left_btn'>
                      <button
                        className='post_auto_button'
                        onClick={() => autoPostDaily()}>
                        <i className='fa-solid fa-pen'></i>&nbsp;
                        {` '${selectedKey.name}'`} 글 생성하기
                      </button>
                      <button
                        id='clipboard_copy_btn'
                        className='post_auto_button'
                        data-clipboard-target='.post_auto_daily_content'
                        onClick={() => openNoti()}>
                        <i className='fa-regular fa-copy'></i>&nbsp; 클립보드 복사
                      </button>
                    </div>
                    <button
                      className='post_auto_button'
                      onClick={() => clearPost()}>
                      <i className='fa-regular fa-trash-can'></i>&nbsp;초기화
                    </button>
                  </div>
                  {isLoading ? (
                    <Box
                      display='flex'
                      justifyContent='center'
                      alignItems='center'>
                      <CircularProgress color='secondary' />
                      <Typography>글 생성중...</Typography>
                    </Box>
                  ) : (
                    <></>
                  )}
                  <div className='post_auto_daily_content'></div>
                </div>
              ) : (
                <div className='post_auto_custom_div'></div>
              )}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
      {/* /AutoPosting  */}
      <ReactTooltip
        id='line-tooltip'
        place='bottom'
        content='복수의 키워드 비교는 상대적인 수치로 표출되기 때문에 다른 키워드로 관심도 비교시 수치가 달라질 수 있습니다.'
      />
      <ReactTooltip
        id='daily-tooltip'
        place='bottom'
        content='Word Cloud에서 선택한 키워드를 기반으로 게시글을 작성합니다.'
      />
      <ReactTooltip
        id='custom-tooltip'
        place='bottom'
        content='원하는 키워드를 입력하여 블로그 주제를 추천받고 선택한 주제를 기반으로 게시글을 작성합니다.'
      />
      <Snackbar
        open={showNoti}
        autoHideDuration={1500}
        message='클립보드에 복사되었습니다.'
        onClose={closeNoti}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}></Snackbar>
    </div>
  );
}

export default TrendKeyword;
