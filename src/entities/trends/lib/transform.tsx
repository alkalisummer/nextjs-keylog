import { Trend } from '../model';
import css from '../ui/keywordScroll/keywordScroll.module.scss';

interface FormatTrafficProps {
  traffic: string;
  isKor?: boolean;
}

export const formatTraffic = ({ traffic, isKor = true }: FormatTrafficProps) => {
  if (traffic.includes('0000')) {
    return traffic.replace('0000', '') + (isKor ? '만' : 'K');
  }
  if (traffic.includes('000')) {
    return traffic.replace('000', '') + (isKor ? '천' : 'K');
  }
  return traffic;
};

export const stringifyKeywords = (trends: Trend[]) => {
  return trends.map(trend => trend.keyword).join(',');
};

export const parseKeywordsArray = (trends: Trend[]) => {
  return trends.map(trend => ({
    content: (
      <div>
        <span className={css.keyword}>{trend.keyword}</span>
        <span className={css.traffic}>{`${formatTraffic({ traffic: trend.traffic, isKor: false })}+`}</span>
      </div>
    ),
    data: trend,
  }));
};
