/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { replaceSymbol, timeAgoFormat } from './CommonUtils';
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

interface imgData {
  link: string;
  sizeheight: string;
  sizewidth: string;
  thumbnail: string;
  title: string;
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

  const [lineKeyword, setLineKeyword] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');

  const [selectedKey, setSelectedKey] = useState<seletedKey>();
  const [articles, setArticles] = useState<article[]>([]);
  const [baseDate, setBaseDate] = useState('');

  const [imgLoading, setImgLoading] = useState(false);

  const [autoKeyword, setAutoKeyword] = useState('');
  const [imgKeyword, setImgKeyword] = useState('');

  const [ref, inView] = useInView();
  const [imgArr, setImgArr] = useState<imgData[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [selectedImgUrl, setSelectedImgUrl] = useState('');

  useEffect(() => {
    import('echarts-wordcloud');
    new ClipboardJS('#clipboard_copy_btn');
    let keyArr: keyword[] = [];

    DailyTrends('en').then((res) => {
      setBaseDate(res.baseDate);
      keyArr = res.keyArr;
      if (wChartDom.current) {
        let wordCloud = echarts.getInstanceByDom(wChartDom.current);
        if (!wordCloud) {
          wordCloud = echarts.init(wChartDom.current);
          wordCloud.on('finished', () => {
            document.querySelector('.post_main')?.scrollTo(0, 0);
          });

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
            setAutoKeyword(params.name);
            setImgKeyword(params.name);
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

        if (!wordCloud) {
          wordCloud = echarts.init(wChartDom.current);
        }
        if (!lineChart) {
          lineChart = echarts.init(lChartDom.current);
        }

        if (wordCloud) {
          wordCloud.resize();
        }
        if (lineChart) {
          lineChart.resize();
        }
      }
    });
  }, []);

  useEffect(() => {
    if (lineKeyword.length > 0) {
      if (!showLineChart) {
        setShowLineChart(true);
      }
      const getLineChart = async () => {
        const queryParams = { type: 'interestOverTime', keyword: lineKeyword };
        await axios.post('/api/HandleKeyword', { params: queryParams }).then((result) => {
          let interestRes: any;
          try {
            interestRes = JSON.parse(result.data);
          } catch (error) {
            console.log(error);
            getLineChart();
          }

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
      };

      getLineChart();
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

  const deleteTerm = (keyId: string) => {
    const resultArr = JSON.parse(JSON.stringify(lineKeyword));
    resultArr.splice(parseInt(keyId), 1);
    setLineKeyword(resultArr);
  };

  const autoPostDaily = async () => {
    if (!autoKeyword) {
      setShowNoti(true);
      setNotiMsg('키워드를 입력해주세요.');
      return;
    }

    clearPost();
    const chatMsg = await ArticlePrompt(autoKeyword);
    if (Object.keys(chatMsg).length === 0) {
      openNoti('autoPost');
      return;
    }

    const chatCompletion = await ChatGptHandle('auto-post', chatMsg);
    const contentDiv = document.querySelector('.post_auto_daily_content');
    let gptMsg = '';

    for await (const chunk of chatCompletion) {
      const chunkText = chunk.choices[0].delta.content;
      if (chunkText) {
        gptMsg += chunkText;
        contentDiv!.innerHTML = gptMsg;
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
      const imgParams = {
        type: 'searchImage',
        keyword: imgKeyword,
        pageNum: pageNum,
      };
      await axios.post('/api/HandleKeyword', { params: imgParams }).then((result) => {
        const imgArr = result.data;
        if (imgArr.length > 0) {
          setImgArr((prev) => [...prev, ...imgArr]);
        }
      });
      setImgLoading(false);
    }
  };

  useEffect(() => {
    searchImg();
  }, [pageNum]);

  useEffect(() => {
    if (inView && !imgLoading) {
      setPageNum((prev) => prev + 1);
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
    <div>
      {/* WordCloud  */}
      <div className='post_daily_keyword_div'>
        <span className='post_daily_keyword_title'>Daily Keyword</span>
        <span className='post_base_date'>{baseDate}</span>
      </div>
      <div className='post_wordcloud_div'>
        <div id='wordcloud' ref={wChartDom} style={{ width: '50%', height: '400px' }}></div>
        <div className='post_linkage_div'>
          <span className='post_linkage_title'>{`연관 검색어 ${selectedKey?.name ? ' : ' + selectedKey.name : ''}`}</span>
          <div className='post_linkage_tag_div'>
            {linkage.map((obj, idx) => {
              return (
                <Link key={idx} href={`https://www.google.com/search?q=${obj}`} target='_blank'>
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
            <i className='fa-regular fa-circle-question tooltip' data-tooltip-id='line-tooltip' data-tooltip-html={'복수의 키워드 비교는 최대 5개까지 가능합니다. <br/> 키워드 비교는 상대적인 수치로 표출되기 때문에 다른 키워드로 비교시 수치가 달라질 수 있습니다.'}></i>
          </span>

          <button className='post_fold_btn' onClick={() => setShowLineChart(!showLineChart)}>
            {showLineChart ? '접기 ▲' : '펼치기 ▼'}
          </button>
        </div>
        <div className='post_line_chart_div' style={{ display: showLineChart ? '' : 'none' }}>
          <div className='post_line_keyword_div'>
            {lineKeyword.map((obj: string, idx: number) => {
              return (
                <div key={idx} id={idx.toString()} className='post_line_keyword'>
                  <span>{obj}</span>
                  <i className='fa-solid fa-xmark post_line_keyword_delete' onClick={() => deleteTerm(idx.toString())}></i>
                </div>
              );
            })}
            {lineKeyword.length !== 5 && showAddterm ? (
              <button id='addTerm' className='post_line_keyword' onClick={() => addTerm()}>
                + 비교 추가
              </button>
            ) : (
              ''
            )}
          </div>
          <div id='lineChart' ref={lChartDom} style={{ width: '100%', height: '400px' }}></div>
        </div>
      </div>
      {/* /Interest Over Time */}
      {/* Article  */}
      <div className='post_sub_div'>
        <div className='post_sub_title_div'>
          <span className='post_sub_title'>Articles</span>
          <button className='post_fold_btn' onClick={() => setShowArticles(!showArticles)}>
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
                <div className='post_article' key={idx}>
                  <Link href={article.url} target='_blank'>
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
                        <img alt='article img' src={article.image.imageUrl}></img>
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
          <span className='post_sub_title'>
            Auto Posting
            <i className='fa-regular fa-circle-question tooltip' data-tooltip-id='daily-tooltip' data-tooltip-html={'입력한 키워드를 기반으로 게시글을 작성합니다.<br/> 자동생성된 게시글을 참고하여 작성해보세요.'}></i>
          </span>
          <button className='post_fold_btn' onClick={() => setShowAutoPost(!showAutoPost)}>
            {showAutoPost ? '접기 ▲' : '펼치기 ▼'}
          </button>
        </div>
        {showAutoPost ? (
          <div className='post_auto_daily_div'>
            <div className='post_auto_btn_div'>
              <div className='post_auto_left_btn'>
                <span className='post_auto_keyword_title'>키워드 : </span>&nbsp;
                <input type='text' className='post_auto_input' value={autoKeyword} onChange={(e) => setAutoKeyword(e.target.value)} />
                <button className='post_auto_button' onClick={() => autoPostDaily()}>
                  <i className='fa-solid fa-pen'></i>&nbsp; 글 생성하기
                </button>
                <button id='clipboard_copy_btn' className='post_auto_button' data-clipboard-target='.post_auto_daily_content' onClick={() => openNoti('clipboard')}>
                  <i className='fa-regular fa-copy'></i>&nbsp; 클립보드 복사
                </button>
              </div>
              <button className='post_auto_button' onClick={() => clearPost()}>
                <i className='fa-regular fa-trash-can'></i>&nbsp;초기화
              </button>
            </div>
            <div className='post_auto_daily_content'></div>
          </div>
        ) : (
          ''
        )}
      </div>
      {/* /AutoPosting  */}
      {/* Image  */}
      <div className='post_sub_div'>
        <div className='post_sub_title_div'>
          <span className='post_sub_title'>
            Image
            <i className='fa-regular fa-circle-question tooltip' data-tooltip-id='image-tooltip' data-tooltip-html={'입력한 키워드의 이미지를 검색합니다.<br/> 게시글에 이미지를 삽입해보세요.'}></i>
          </span>
          <button className='post_fold_btn' onClick={() => setShowImage(!showImage)}>
            {showImage ? '접기 ▲' : '펼치기 ▼'}
          </button>
        </div>
        {showImage ? (
          <div className='post_auto_daily_div'>
            <div className='post_auto_btn_div'>
              <div className='post_auto_left_btn'>
                <span className='post_auto_keyword_title'>키워드 : </span>&nbsp;
                <input type='text' className='post_auto_input' value={imgKeyword} onChange={(e) => setImgKeyword(e.target.value)} />
                <button
                  className='post_auto_button'
                  onClick={() => {
                    clearImage();
                    searchImg();
                  }}
                >
                  <i className='fa-regular fa-image'></i>&nbsp; 이미지 검색
                </button>
                <button id='clipboard_copy_btn' className='post_auto_button' data-clipboard-text={selectedImgUrl} onClick={() => openNoti('imageCopy')}>
                  <i className='fa-regular fa-copy'></i>&nbsp; 이미지 URL 복사
                </button>
              </div>
              <button className='post_auto_button' onClick={() => clearImage()}>
                <i className='fa-regular fa-trash-can'></i>&nbsp;초기화
              </button>
            </div>
            <div className='post_img_div'>
              {imgArr.map((img, idx) => (
                <React.Fragment key={idx}>{imgArr.length - 1 === idx ? <img ref={ref} className='post_img' onClick={(e) => selectImg(e.target)} src={img.link} alt='검색 이미지' /> : <img className='post_img' onClick={(e) => selectImg(e.target)} src={img.link} alt='검색 이미지' />}</React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {/* /Image */}
      <ReactTooltip id='line-tooltip' place='bottom' />
      <ReactTooltip id='daily-tooltip' place='bottom' />
      <ReactTooltip id='image-tooltip' place='bottom' />
      <Snackbar
        open={showNoti}
        autoHideDuration={6000}
        message={notiMsg}
        onClose={closeNoti}
        action={
          <React.Fragment>
            <Button color='primary' size='small' onClick={closeNoti}>
              확인
            </Button>
          </React.Fragment>
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      ></Snackbar>
    </div>
  );
};

export default React.memo(TrendKeyword);
