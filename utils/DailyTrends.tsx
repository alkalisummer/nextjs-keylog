import React from 'react';
import axios from 'axios';
import { timeFormat } from './CommonUtils';

interface keyword {
  name: string;
  value: number;
  articles: [];
}

const DailyTrends = async () => {
  let keyArr: keyword[] = [];
  let trendKeyData: any[] = [];
  let baseDate = '';

  const dailyTrendsparam = { type: 'dailyTrends' };
  await axios.get('/api/HandleKeyword', { params: dailyTrendsparam }).then((result) => {
    const res = JSON.parse(result.data).default.trendingSearchesDays;
    baseDate = `(기준일: ${timeFormat(res[res.length - 1].date)} - ${timeFormat(res[0].date)})`;
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
  });
  return { keyArr, trendKeyData, baseDate };
};

export default DailyTrends;
