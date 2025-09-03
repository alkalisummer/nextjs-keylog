import { Trend } from '@/entities/trend/model';

export const initTrendData = (): Trend => ({
  keyword: '',
  articleKeys: [],
  traffic: '',
  trafficGrowthRate: '',
  activeTime: '',
  relatedKeywords: [],
});
