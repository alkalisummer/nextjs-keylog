import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import * as echarts from 'echarts';

function TrendKeyword() {
  const chartDom = useRef(null);

  interface keyword {
    name: string;
    value: number;
  }

  let keyArr: keyword[] = [];
  let trendKeyData: any[] = [];

  useEffect(() => {
    import('echarts-wordcloud');
  }, []);

  //google daily trend keyword API 함수(금일 기준 20개 내외)
  const getDailyTrend = () => axios.get('/api/HandleKeyword');
  const { status, data, error } = useQuery({ queryKey: ['dailyTrend'], queryFn: getDailyTrend, refetchOnWindowFocus: false });

  if (status === 'success') {
    const res = JSON.parse(data.data).default.trendingSearchesDays;

    for (let dateData of res) {
      dateData.trendingSearches.map((obj: any) => {
        //traffic 한글 포맷을 숫자포맷으로 변경(ex: '1천' -> 1000)
        const trfficStr = obj.formattedTraffic;
        const num = parseInt(trfficStr.substr(0, 1));
        const formatNum = trfficStr.substr(1, 1) === '만' ? 10000 : 1000;
        const newFormatNum = num * formatNum;
        obj.formattedTraffic = newFormatNum;

        trendKeyData.push(obj);
      });
    }

    keyArr = trendKeyData.map((obj) => ({ name: obj.title.query, value: obj.formattedTraffic }));
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
            top: -50,
            width: '70%',
            height: '80%',
            right: null,
            bottom: null,
            sizeRange: [20, 90],
            rotationRange: [-90, 90],
            rotationStep: 45,
            gridSize: 14,
            drawOutOfBound: false,
            shrinkToFit: false,
            layoutAnimation: true,
            textStyle: {
              fontFamily: 'sans-serif',
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
                textShadowBlur: 10,
                textShadowColor: '#333',
              },
            },
            data: keyArr,
          },
        ],
      };
      myChart.setOption(chartOpt);
    }
  }

  if (status === 'error') {
    console.log(error);
  }

  return (
    <div>
      <span className='post_word_cloud_title'>Daily Keyword</span>
      <div
        id='wordcloud'
        ref={chartDom}
        style={{ width: '100%', height: '360px' }}></div>
    </div>
  );
}

export default TrendKeyword;
