import { ImageItem, Trend, InterestOverTime } from '../model';
import css from '../ui/keywordScroll/keywordScroll.module.scss';

interface FormatTrafficProps {
  traffic: string;
  isKor?: boolean;
}

export const formatTraffic = ({ traffic, isKor = true }: FormatTrafficProps) => {
  if (traffic.includes('0000')) {
    return traffic.replace('0000', '') + (isKor ? '만' : 'M');
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

export const parseValidKeywordDataList = (
  keywordToDataMap: Record<string, InterestOverTime>,
  seriesKeywords: string[],
): InterestOverTime[] => {
  return seriesKeywords
    .map(keyword => keywordToDataMap[keyword])
    .filter(keywordData => !!keywordData && Array.isArray(keywordData.values) && keywordData.values.length > 0);
};

export const normalizeUrl = (url: string) => url.replace(/^http:\/\//i, 'https://');

export const mergeUniqueImages = (base: ImageItem[], incoming: ImageItem[]) => {
  const seen = new Set(base.map(img => img.link || ''));
  const merged: ImageItem[] = [...base];
  for (const img of incoming) {
    const key = img.link || '';
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(img);
    }
  }
  return merged;
};
