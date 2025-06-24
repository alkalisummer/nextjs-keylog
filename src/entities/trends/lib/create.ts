import { Trend } from '../model';
import { formatTraffic } from './transform';

export const createDailyTrends = (trends: Trend[]) => {
  return trends
    .filter(trend => {
      // 한글이 포함된 키워드만 필터링 (한글 정규식: /[가-힣]/)
      const koreanRegex = /[가-힣]/;
      return koreanRegex.test(trend.keyword);
    })
    .map(
      trend =>
        <Trend>{
          keyword: decodeURIComponent(trend.keyword),
          traffic: trend.traffic,
          trafficGrowthRate: trend.trafficGrowthRate,
          activeTime: trend.activeTime,
          relatedKeywords: trend.relatedKeywords,
          articleKeys: trend.articleKeys,
        },
    ) // traffic 내림 차순 정렬
    .sort((a, b) => Number(b.traffic) - Number(a.traffic));
};
