import { ArticleKey } from '@/entities/article/model';

export interface Trend {
  keyword: string;
  traffic: number;
  trafficGrowthRate: number;
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

export interface ImageItem {
  link: string;
  sizeheight: string;
  sizewidth: string;
  thumbnail: string;
  title: string;
}

export interface InterestOverTime {
  keyword: string;
  dates: string[];
  values: number[];
}

export interface NaverArticle {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}
