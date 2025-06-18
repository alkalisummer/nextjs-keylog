import { ArticleKey } from '@/entities/articles/model';

export interface Trend {
  keyword: string;
  traffic: string;
  trafficGrowthRate: string;
  activeTime: string;
  relatedKeywords: string[];
  articleKeys: ArticleKey[];
}
