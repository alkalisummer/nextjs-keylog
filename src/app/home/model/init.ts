import { Trend } from '@/entities/trend/model';

export const initTrendData = (): Trend => ({
  keyword: '',
  articleKeys: [],
  traffic: 0,
  trafficGrowthRate: 0,
  activeTime: new Date(),
  relatedKeywords: [],
});
