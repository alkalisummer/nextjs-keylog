import { Trend } from '../model';
import { formatTraffic } from './transform';

export const createDailyTrends = (trends: Trend[]) => {
  return trends.map(
    trend =>
      <Trend>{
        keyword: trend.keyword,
        traffic: formatTraffic(trend.traffic),
        trafficGrowthRate: trend.trafficGrowthRate,
        activeTime: trend.activeTime,
        relatedKeywords: trend.relatedKeywords,
        articleKeys: trend.articleKeys,
      },
  );
};
