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
        //wordcloud value 사용을 위한 traffic format 간소화(ex: 200K+ -> 200)
        const trafficStr = obj.formattedTraffic;
        const reduceNum = parseInt(trafficStr.substr(0, trafficStr.length - 2));
        obj.formattedTraffic = reduceNum;
        trendKeyData.push(obj);
      });
    }

    keyArr = trendKeyData.map((obj) => ({ name: obj.title.query.replaceAll("'", ''), value: obj.formattedTraffic }));
    if (chartDom.current) {
      let myChart = echarts.getInstanceByDom(chartDom.current);
      if (!myChart) {
        myChart = echarts.init(chartDom.current);
      }
      const chartOpt = {
        series: [
          {
            type: 'wordCloud',
            shape: 'star',
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
                textShadowBlur: 10,
                textShadowColor: '#368fc0',
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
