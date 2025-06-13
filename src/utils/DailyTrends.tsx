import axios from 'axios';
import { formatCurrentDate } from './CommonUtils';

interface WordCloudData {
  name: string;
  value: number;
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

const DailyTrends = async (lang: string) => {
  const dailyTrendsparam = { type: 'dailyTrends', lang };
  const trends = (await axios.get('/api/HandleKeyword', { params: dailyTrendsparam })).data.data;
  const baseDate = formatCurrentDate();

  const TrendKeywordCloudData = trends.map((trend: trend) => {
    return {
      name: trend.keyword,
      value: trend.traffic,
      trend: trend,
    };
  });
  return { trends, TrendKeywordCloudData, baseDate };
};

export default DailyTrends;
