import { Trend } from '../model';
import css from '../ui/keywordScroll/keywordScroll.module.scss';

export const formatTraffic = (traffic: string) => {
  if (traffic.includes('0000')) {
    return traffic.replace('0000', '') + '만';
  }
  if (traffic.includes('000')) {
    return traffic.replace('000', '') + '천';
  }
  return traffic;
};

export const stringifyKeywords = (trends: Trend[]) => {
  return trends.map(trend => trend.keyword).join(',');
};

export const parseKeywordsArray = (trends: Trend[]) => {
  return trends.map(trend => ({
    content: <p className={css.keyword}>{trend.keyword}</p>,
    data: trend,
  }));
};
