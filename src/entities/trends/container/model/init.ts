import { Trend } from '@/entities/trends/model';
import { ArticleKey } from '@/entities/articles/model';

export const initTrend = (): Trend => ({
  keyword: '',
  traffic: '',
  trafficGrowthRate: '',
  activeTime: '',
  relatedKeywords: [],
  articleKeys: initArticleKeys(),
});

export const initArticleKeys = (): ArticleKey[] => [
  {
    keyNum: 0,
    lang: '',
    geo: '',
  },
];
