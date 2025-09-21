import { ArticleKey } from '@/entities/article/model';

export interface Trend {
  keyword: string;
  traffic: number;
  trafficGrowthRate: number;
  activeTime: Date;
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

export type GoogleTrendsTimeOptions =
  | 'now 1-H'
  | 'now 4-H'
  | 'now 1-d'
  | 'now 7-d'
  | 'today 1-m'
  | 'today 3-m'
  | 'today 12-m';

export interface NaverArticle {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface NaverBlogPost {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;
}
