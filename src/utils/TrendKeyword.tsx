/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { removeHtml, timeAgoFormat } from './CommonUtils';
import DailyTrends from './DailyTrends';
import ArticlePrompt from './ChatGptPrompt';

//echart - wordcloud, linechart
import * as echarts from 'echarts';
import { WordCloudOpt, LineChartOpt } from './ChartOpt';

//react-tooltip
import { Tooltip as ReactTooltip } from 'react-tooltip';

//clipboard 복사
import ClipboardJS from 'clipboard';

//mui notification
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

//image 검색 무한 스크롤
import { useInView } from 'react-intersection-observer';

//ChatGpt
import ChatGptHandle from '@/utils/ChatGptHandle';

import Image from 'next/image';

interface keyword {
  name: string;
  value: number;
  articles: [];
}

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

interface imgData {
  link: string;
  sizeheight: string;
  sizewidth: string;
  thumbnail: string;
  title: string;
}

interface chartKeyword {
  keyword: string;
  dates: string[];
  values: number[];
}

const TrendKeyword = () => {
  const wChartDom = useRef(null);
  const lChartDom = useRef(null);

  const [showArticles, setShowArticles] = useState(false);
  const [showAutoPost, setShowAutoPost] = useState(false);
  const [showLineChart, setShowLineChart] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showAddterm, setShowAddterm] = useState(true);
  const [showNoti, setShowNoti] = useState(false);
  const [notiMsg, setNotiMsg] = useState('');

  const [linkage, setLinkage] = useState<string[]>([]);

  const [trends, setTrends] = useState<trend[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<trend>();
  const [chartKeywordData, setChartKeywordData] = useState<chartKeyword[]>([]);
  const [articles, setArticles] = useState<article[]>([]);
  const [baseDate, setBaseDate] = useState('');

  const [imgLoading, setImgLoading] = useState(false);
  const [autoPostLoading, setAutoPostLoading] = useState(false);

  const [autoKeyword, setAutoKeyword] = useState('');
  const [imgKeyword, setImgKeyword] = useState('');

  const [ref, inView] = useInView();
  const [imgArr, setImgArr] = useState<imgData[]>([]);
  const [pageNum, setPageNum] = useState<number>();
  const [selectedImgUrl, setSelectedImgUrl] = useState('');

  useEffect(() => {
    import('echarts-wordcloud');
    new ClipboardJS('#clipboard_copy_btn');

    DailyTrends('ko').then(res => {
      setBaseDate(res.baseDate);
      setTrends(res.trends);
      const trendKeywordCloudData = res.TrendKeywordCloudData;
      if (wChartDom.current) {
        let wordCloud = echarts.getInstanceByDom(wChartDom.current);
        if (!wordCloud) {
          wordCloud = echarts.init(wChartDom.current);
          const wordCloudOpt = WordCloudOpt(trendKeywordCloudData);
          wordCloud.setOption(wordCloudOpt);

          //wordcloud 키워드 클릭 이벤트
          wordCloud.on('click', params => {
            //setLineKeyword([{ groupName: params.name, keywords: [params.name] }]);
            const queryParams = { type: 'relatedQueries', keyword: params.name };
            //선택한 키워드의 연관 검색어
            axios.get('/api/HandleKeyword', { params: queryParams }).then(result => {
              const suggestRes = result.data;
              setLinkage(suggestRes);
            });

            const currentTrend = res.trends.find((trend: trend) => trend.keyword === params.name);
            setSelectedKeyword(currentTrend);
            // const articleData = JSON.parse(JSON.stringify(params.data)).articles;
            // setKeywordArticles(articleData, params.name);
            setAutoKeyword(params.name);
            setImgKeyword(params.name);
            setPageNum(0);
            setImgLoading(false);
            if (!showArticles) {
              setShowArticles(true);
            }
            if (!showAutoPost) {
              setShowAutoPost(true);
            }
            if (!showImage) {
              setShowImage(true);
            }
          });
        }
      }
    });

    //word-cloud, line-chart 화면사이즈 변경시 resize
    window.addEventListener('resize', () => {
      if (wChartDom.current) {
        let wordCloud = echarts.getInstanceByDom(wChartDom.current);
        let lineChart = echarts.getInstanceByDom(lChartDom.current!);

        if (wordCloud) {
          wordCloud.resize();
        }
        if (lineChart) {
          lineChart.resize();
        }
      }
    });

    setTimeout(() => {
      document.querySelector('.write_div')?.scrollTo(0, 0);
    }, 300);
  }, []);

  useEffect(() => {
    if (selectedKeyword?.keyword) {
      if (!showLineChart) {
        setShowLineChart(true);
      }
      const getLineChart = async () => {
        const queryParams = { type: 'interestOverTime', keyword: selectedKeyword.keyword };
        await axios.post('/api/HandleKeyword', { params: queryParams }).then(result => {
          const interestResArr = result.data.data;

          setChartKeywordData([...chartKeywordData, interestResArr]);

          let lineChartDate: string[] = [];
          let lineChartValueArr = [];
          let lineChartkeywordArr: string[] = [];

          const randomColor = () => {
            return (
              'rgb(' +
              [Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(
                ',',
              ) +
              ')'
            );
          };

          const timeLineData = (chartKeyword: chartKeyword) => {
            let res = [];

            if (chartKeyword) {
              lineChartkeywordArr.push(chartKeyword.keyword);
              for (let value of chartKeyword.values) {
                res.push(Math.round(value));
                lineChartDate = chartKeyword.dates;
              }
            }
            return res;
          };

          lineChartValueArr.push({
            name: interestResArr.keyword,
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: randomColor(),
            },
            data: timeLineData(interestResArr),
          });

          if (lChartDom.current) {
            let lineChart = echarts.getInstanceByDom(lChartDom.current);
            if (!lineChart) {
              lineChart = echarts.init(lChartDom.current);
            }
            const lineChartOpt = LineChartOpt({
              dateArr: lineChartDate,
              valueArr: lineChartValueArr,
              legendArr: lineChartkeywordArr,
            });
            lineChart.clear();
            lineChart.setOption(lineChartOpt);
          }
        });
      };

      getLineChart();
    }
  }, [selectedKeyword]);

  // const addTerm = () => {
  //   setShowAddterm(false);
  //   const parentDiv = document.querySelector('.post_line_keyword_div');
  //   const keywordInput = document.createElement('input');

  //   keywordInput.className = 'post_line_keyword';
  //   keywordInput.placeholder = '검색어 추가';
  //   keywordInput.value = '';
  //   keywordInput.onchange = (e: Event) => {
  //     const value = (e.target as HTMLInputElement).value;
  //     if (value) {
  //       setNewKeyword({ groupName: value, keywords: [value] });
  //     }
  //   };
  //   keywordInput.addEventListener('keydown', function (event: KeyboardEvent) {
  //     if (event.key === 'Enter' && keywordInput.value) {
  //       setShowAddterm(true);
  //       //중복제거
  //       if (lineKeyword.findIndex(obj => obj.groupName === keywordInput.value) === -1) {
  //         setLineKeyword(prev => [...prev, { groupName: keywordInput.value, keywords: [keywordInput.value] }]);
  //       }
  //       //input 제거 및 초기화
  //       keywordInput.remove();
  //       setNewKeyword({ groupName: '', keywords: [] });
  //     } else if (event.key === 'Escape') {
  //       setShowAddterm(true);
  //       keywordInput.remove();
  //     }
  //   });
  //   parentDiv?.append(keywordInput);
  // };

  // const deleteTerm = (keyId: string) => {
  //   const resultArr = JSON.parse(JSON.stringify(lineKeyword));
  //   resultArr.splice(parseInt(keyId), 1);
  //   setLineKeyword(resultArr);
  // };

  const setKeywordArticles = async (articles: article[], keyword: string) => {
    //제목에 키워드가 없는 기사 필터링
    let resultArticles = [];
    let keywordArr = [];
    keywordArr = keyword.replaceAll(' ', '').split('');
    for (let article of articles) {
      if (article.image) {
        for (let i = 0; i < keywordArr.length; i++) {
          if (article.title.toUpperCase().indexOf(keywordArr[i].toUpperCase()) === -1) {
            break;
          }
          if (i === keywordArr.length - 1) {
            resultArticles.push(article);
          }
        }
      }
    }

    setArticles(resultArticles);
  };

  const autoPostHandler = () => {
    if (!autoKeyword) {
      setShowNoti(true);
      setNotiMsg('키워드를 입력해주세요.');
      return;
    }

    setAutoPostLoading(true);
    if (!autoPostLoading) {
      clearPost();
      autoPostDaily();
    }
  };

  interface message {
    role: string;
    content: string;
  }

  const autoPostDaily = async () => {
    const chatMsg = (await ArticlePrompt(autoKeyword)) as message;
    if (Object.keys(chatMsg).length === 0) {
      openNoti('autoPost');
      return;
    }
    const chatCompletion = await ChatGptHandle('auto-post', chatMsg);
    const contentDiv = document.querySelector('.post_auto_daily_content');
    let gptMsg = '';

    for await (const chunk of chatCompletion) {
      if (chunk.choices[0].finish_reason) {
        setAutoPostLoading(false);
      }
      const chunkText = chunk.choices[0].delta.content;
      if (chunkText) {
        gptMsg += chunkText;
        contentDiv!.innerHTML = gptMsg.replaceAll('```html', '').replaceAll('```', '');
      }
    }
  };

  const clearPost = () => {
    document.querySelector('.post_auto_daily_content')!.innerHTML = '';
  };

  const clearImage = () => {
    document.querySelector('.post_img_div')!.innerHTML = '';
    setSelectedImgUrl('');
  };

  const openNoti = (type: string) => {
    setShowNoti(true);
    if (type === 'clipboard') {
      const autoPostContent = document.querySelector('.post_auto_daily_content')?.innerHTML;
      if (autoPostContent) {
        setNotiMsg('클립보드에 복사되었습니다.');
      } else {
        setNotiMsg('복사할 내용이 없습니다.');
      }
    } else if (type === 'autoPost') {
      setNotiMsg('글 작성을 위한 데이터가 부족합니다.');
    } else if (type === 'imageCopy') {
      if (selectedImgUrl) {
        setNotiMsg('이미지 주소를 복사였습니다.');
      } else {
        setNotiMsg('이미지를 선택해주세요.');
      }
    }
  };

  const closeNoti = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNoti(false);
  };

  const searchImg = async () => {
    if (imgKeyword) {
      setImgLoading(true);
      nextSearchImg(1);
    }
  };

  const nextSearchImg = async (pageNum: number) => {
    const imgParams = {
      type: 'searchImage',
      keyword: imgKeyword,
      pageNum: pageNum,
    };
    await axios.post('/api/HandleKeyword', { params: imgParams }).then(result => {
      const res = result.data;
      const imageArr = res.filter((image: any) => image.link.indexOf('imgnews.naver.net') !== -1);
      if (imageArr.length > 0) {
        setImgArr(prev => [...prev, ...imageArr]);
      }
    });
    setImgLoading(false);
  };

  useEffect(() => {
    if (pageNum) {
      nextSearchImg(pageNum);
    }
  }, [pageNum]);

  useEffect(() => {
    if (inView && !imgLoading) {
      setPageNum(prev => prev! + 1);
    }
  }, [inView]);

  const selectImg = (eTarget: any) => {
    const imgUrl = eTarget.getAttribute('src');
    setSelectedImgUrl(imgUrl);

    // 이미지 클릭시 css 효과 적용
    const selectedImg = document.querySelector('.post_img_focus');
    if (selectedImg) {
      selectedImg.classList.remove('post_img_focus');
    }
    eTarget.setAttribute('class', 'post_img post_img_focus');
  };

  return (
    <div className="post_keyword_div">
      {/* WordCloud  */}
      <div className="post_daily_keyword_div">
        <span className="post_daily_keyword_title">
          Daily Keyword
          <span>
            <i
              className="fa-regular fa-circle-question tooltip"
              data-tooltip-id="keyword-tooltip"
              data-tooltip-html={
                '최근 급상승한 키워드와 연관검색어를 표출합니다.<br/> 연관 검색어 클릭시 해당 키워드로 구글 검색 창을 표출합니다.'
              }
            ></i>
          </span>
        </span>
        <span className="post_base_date">{baseDate}</span>
      </div>
      <div className="post_wordcloud_div">
        <div id="wordcloud" ref={wChartDom} style={{ width: '50%', height: '400px' }}></div>
        <div className="post_linkage_div">
          <span className="post_linkage_title">{`연관 검색어 ${selectedKeyword ? ' : ' + selectedKeyword : ''}`}</span>
          <div className="post_linkage_tag_div">
            {linkage.map((obj, idx) => {
              return (
                <Link key={idx} href={`https://www.google.com/search?q=${obj}`} target="_blank">
                  <span className="post_linkage_tag">{obj}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {/* /WordCloud  */}
      {/* Interest Over Time */}
      <div className="post_sub_div">
        <div className="post_sub_title_div">
          <span className="post_sub_title">
            Interest Change Chart
            <span>
              <i
                className="fa-regular fa-circle-question tooltip"
                data-tooltip-id="line-tooltip"
                data-tooltip-html={
                  '해당 키워드의 1년 검색추이 차트로 표출합니다.<br/> 복수의 키워드 비교는 최대 5개까지 가능합니다. <br/> 키워드 비교는 상대적인 수치로 표출되기 때문에 다른 키워드와 비교시 수치가 달라질 수 있습니다.'
                }
              ></i>
            </span>
          </span>

          <button className="post_fold_btn" onClick={() => setShowLineChart(!showLineChart)}>
            {showLineChart ? '접기 ▲' : '펼치기 ▼'}
          </button>
        </div>
        <div className="post_line_chart_div" style={{ display: showLineChart ? '' : 'none' }}>
          <div className="post_line_keyword_div">
            {chartKeywordData.map((obj: chartKeyword, idx: number) => {
              return (
                <div key={idx} id={idx.toString()} className="post_line_keyword">
                  <span>{obj.keyword}</span>
                  <span>
                    <i
                      className="fa-solid fa-xmark post_line_keyword_delete"
                      // onClick={() => deleteTerm(idx.toString())}
                    ></i>
                  </span>
                </div>
              );
            })}
            {/* {chartKeywordData.length !== 5 && showAddterm ? (
              <button id="addTerm" className="post_line_keyword" onClick={() => addTerm()}>
                + 비교 추가
              </button>
            ) : (
              ''
            )} */}
          </div>
          <div id="lineChart" ref={lChartDom} style={{ width: '100%', height: '400px' }}></div>
        </div>
      </div>
      {/* /Interest Over Time */}
      {/* Article  */}
      <div className="post_sub_div">
        <div className="post_sub_title_div">
          <span className="post_sub_title">
            Articles
            <span>
              <i
                className="fa-regular fa-circle-question tooltip"
                data-tooltip-id="article-tooltip"
                data-tooltip-html={
                  '해당 키워드로 작성된 관련 기사를 표출합니다.<br/> 기사 클릭시 해당 기사의 웹 페이지가 새 창으로 표출됩니다.'
                }
              ></i>
            </span>
          </span>
          <button className="post_fold_btn" onClick={() => setShowArticles(!showArticles)}>
            {showArticles ? '접기 ▲' : '펼치기 ▼'}
          </button>
        </div>
        {showArticles ? (
          <div className="post_articles">
            {selectedKeyword ? (
              <div className="post_selected_div">
                <span className="post_selected_key">{selectedKeyword.keyword}</span>
                <span className="post_selected_cnt">{`(검색량: ${selectedKeyword.traffic}K+)`}</span>
              </div>
            ) : (
              ''
            )}
            {/* {articles.map((article: article, idx: number) => {
              return (
                <div className="post_article" key={idx}>
                  <Link href={article.url} target="_blank">
                    <div className="post_article_detail">
                      <div className="post_article_content">
                        <div className="post_article_content_detail">
                          <span className="post_article_title">{removeHtml(article.title)}</span>
                          <pre>{removeHtml(article.snippet)}</pre>
                          <div className="post_article_summary">
                            <span>{article.source}</span>
                            <span>•{timeAgoFormat(article.timeAgo)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="post_article_img">
                        <img alt="article img" src={article.image.imageUrl}></img>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })} */}
          </div>
        ) : (
          ''
        )}
      </div>
      {/* /Article  */}
      {/* AutoPosting  */}
      <div className="post_sub_div">
        <div className="post_sub_title_div">
          <span className="post_sub_title">
            Auto Posting
            <span>
              <i
                className="fa-regular fa-circle-question tooltip"
                data-tooltip-id="daily-tooltip"
                data-tooltip-html={
                  '입력한 키워드의 기사를 분석하여 자동으로 블로그 포스트를 작성합니다.<br/> 자동생성된 게시글을 참고하여 작성해보세요.'
                }
              ></i>
            </span>
          </span>
          <button className="post_fold_btn" onClick={() => setShowAutoPost(!showAutoPost)}>
            {showAutoPost ? '접기 ▲' : '펼치기 ▼'}
          </button>
        </div>
        {showAutoPost ? (
          <div className="post_auto_daily_div">
            <div className="post_auto_btn_div">
              <div className="post_auto_left_btn">
                <span className="post_auto_keyword_title">키워드 : </span>&nbsp;
                <input
                  type="text"
                  className="post_auto_input"
                  value={autoKeyword}
                  onChange={e => setAutoKeyword(e.target.value)}
                />
                <button className="post_auto_button" onClick={() => autoPostHandler()}>
                  <span>
                    <i className="fa-solid fa-pen"></i>
                  </span>
                  &nbsp; 글 생성하기
                </button>
                <button
                  id="clipboard_copy_btn"
                  className="post_auto_button"
                  data-clipboard-target=".post_auto_daily_content"
                  onClick={() => openNoti('clipboard')}
                >
                  <span>
                    <i className="fa-regular fa-copy"></i>
                  </span>
                  &nbsp; 클립보드 복사
                </button>
              </div>
              <button className="post_auto_button" onClick={() => clearPost()}>
                <span>
                  <i className="fa-regular fa-trash-can"></i>
                </span>
                &nbsp;초기화
              </button>
            </div>
            <div className="post_auto_daily_content"></div>
          </div>
        ) : (
          ''
        )}
      </div>
      {/* /AutoPosting  */}
      {/* Image  */}
      <div className="post_sub_div">
        <div className="post_sub_title_div">
          <span className="post_sub_title">
            Image
            <span>
              <i
                className="fa-regular fa-circle-question tooltip"
                data-tooltip-id="image-tooltip"
                data-tooltip-html={'입력한 키워드의 이미지를 검색합니다.<br/> 게시글에 이미지를 삽입해보세요.'}
              ></i>
            </span>
          </span>
          <button className="post_fold_btn" onClick={() => setShowImage(!showImage)}>
            {showImage ? '접기 ▲' : '펼치기 ▼'}
          </button>
        </div>
        {showImage ? (
          <div className="post_auto_daily_div">
            <div className="post_auto_btn_div">
              <div className="post_auto_left_btn">
                <span className="post_auto_keyword_title">키워드 : </span>&nbsp;
                <input
                  type="text"
                  className="post_auto_input"
                  value={imgKeyword}
                  onChange={e => setImgKeyword(e.target.value)}
                />
                <button
                  className="post_auto_button"
                  onClick={() => {
                    clearImage();
                    searchImg();
                  }}
                >
                  <span>
                    <i className="fa-regular fa-image"></i>
                  </span>
                  &nbsp; 이미지 검색
                </button>
                <button
                  id="clipboard_copy_btn"
                  className="post_auto_button"
                  data-clipboard-text={selectedImgUrl}
                  onClick={() => openNoti('imageCopy')}
                >
                  <span>
                    <i className="fa-regular fa-copy"></i>
                  </span>
                  &nbsp; 이미지 URL 복사
                </button>
              </div>
              <button className="post_auto_button" onClick={() => clearImage()}>
                <span>
                  <i className="fa-regular fa-trash-can"></i>
                </span>
                &nbsp;초기화
              </button>
            </div>
            <div className="post_img_div">
              {imgArr.length > 0 &&
                imgArr.map((img, idx) => (
                  <div className="w100" key={idx}>
                    <Image
                      ref={imgArr.length - 1 === idx ? ref : null}
                      width={100}
                      height={100}
                      style={{ borderRadius: '10px', width: '100%', height: 'auto' }}
                      onClick={e => selectImg(e.target)}
                      src={img.link}
                      alt="검색 이미지"
                    />
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {/* /Image */}
      <ReactTooltip id="keyword-tooltip" place="bottom" />
      <ReactTooltip id="line-tooltip" place="bottom" />
      <ReactTooltip id="article-tooltip" place="bottom" />
      <ReactTooltip id="daily-tooltip" place="bottom" />
      <ReactTooltip id="image-tooltip" place="bottom" />
      <Snackbar
        open={showNoti}
        autoHideDuration={6000}
        message={notiMsg}
        onClose={closeNoti}
        action={
          <React.Fragment>
            <Button color="primary" size="small" onClick={closeNoti}>
              확인
            </Button>
          </React.Fragment>
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      ></Snackbar>
    </div>
  );
};

export default TrendKeyword;
