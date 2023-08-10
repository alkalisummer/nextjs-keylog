import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as echarts from 'echarts';
import { timeFormat } from './CommonUtils';

function TrendKeyword() {
  const chartDom = useRef(null);
  const [showArticles, setShowArticles] = useState(false);
  const [baseDate, setBaseDate] = useState('');

  useEffect(() => {
    import('echarts-wordcloud');

    interface keyword {
      name: string;
      value: number;
      articles: [];
    }

    let keyArr: keyword[] = [];
    let trendKeyData: any[] = [];

    axios.get('/api/HandleKeyword').then((result) => {
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
              left: 'center',
              top: 0,
              width: '70%',
              height: '80%',
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
          const articles = JSON.parse(JSON.stringify(params.data)).articles;
          if (!showArticles) {
            setShowArticles(true);
          }
        });
      }
    });
  }, []);

  return (
    <div>
      <div className='post_word_cloud_div'>
        <span className='post_word_cloud_title'>Daily Keyword</span>
        <span className='post_base_date'>{baseDate}</span>
      </div>
      <div
        id='wordcloud'
        ref={chartDom}
        style={{ width: '100%', height: '360px' }}></div>
      <div className='post_articles_div'>
        <div className='post_articles_title_div'>
          <span className='post_articles_title'>Articles</span>
          <button
            className='post_articles_fold_btn'
            onClick={() => setShowArticles(!showArticles)}>
            {showArticles ? '접기 ▲' : '펼치기 ▼'}
          </button>
        </div>
        <div className='post_articles'></div>
      </div>
    </div>
  );
}

export default TrendKeyword;
