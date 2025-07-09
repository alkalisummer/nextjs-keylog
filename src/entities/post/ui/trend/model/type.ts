import { ArticleKey } from '@/entities/article/model';

export interface Trend {
  keyword: string;
  traffic: string;
  trafficGrowthRate: string;
  activeTime: string;
  relatedKeywords: string[];
  articleKeys: ArticleKey[];
}

export interface SpeedBreakpoints {
  desktop?: number; // >= 1200px
  tablet?: number; // >= 768px
  mobile?: number; // >= 480px
  small?: number; // < 480px
}
