import {
  ImageItem,
  Trend,
  InterestOverTimeRaw,
  InterestOverTime,
  NaverArticle,
  NaverBlogPost,
  GoogleTrendsTimeOptions,
} from '../model';
import css from '../component/keywordScroll/ui/view.module.scss';

interface FormatTrafficProps {
  traffic: number;
  isKor?: boolean;
}

export const formatTraffic = ({ traffic, isKor = true }: FormatTrafficProps) => {
  if (traffic >= 10000) {
    return traffic.toString().replace('0000', '') + (isKor ? '만' : 'M');
  }
  if (traffic >= 1000) {
    return traffic.toString().replace('000', '') + (isKor ? '천' : 'K');
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

export const parseValidKeywordDataList = ({
  interestOverTimeData,
  keywords,
}: {
  interestOverTimeData: InterestOverTimeRaw;
  keywords: string[];
}): InterestOverTime[] => {
  const result: InterestOverTime[] = [];
  keywords.forEach((keyword, idx) => {
    result.push({
      keyword,
      dates: interestOverTimeData.dates,
      values: interestOverTimeData.values.map(value => value[idx]),
    });
  });
  return result;
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

const monthMap: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

export const parsePubDate = (value: string): Date => {
  const native = new Date(value);
  if (!Number.isNaN(native.getTime())) return native;

  const m = value.trim().match(/^(?:\w{3},\s*)?(\d{2})\s+(\w{3})\s+(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+([+-]\d{4})$/);
  if (!m) return new Date(NaN);

  const day = parseInt(m[1], 10);
  const monthStr = m[2].toLowerCase();
  const year = parseInt(m[3], 10);
  const hour = parseInt(m[4], 10);
  const minute = parseInt(m[5], 10);
  const second = parseInt(m[6], 10);
  const tz = m[7];

  const month = monthMap[monthStr];
  if (month === undefined) return new Date(NaN);

  const sign = tz.startsWith('+') ? 1 : -1;
  const offH = parseInt(tz.slice(1, 3), 10) || 0;
  const offM = parseInt(tz.slice(3, 5), 10) || 0;
  const offsetMinutes = sign * (offH * 60 + offM);

  const utcMs = Date.UTC(year, month, day, hour, minute, second) - offsetMinutes * 60 * 1000;
  return new Date(utcMs);
};

const getNaverItemDate = (item: NaverArticle | NaverBlogPost): Date => {
  if ('pubDate' in item) return parsePubDate(item.pubDate);
  if ('postdate' in item) {
    const m = item.postdate.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (m) {
      const year = Number(m[1]);
      const month = Number(m[2]);
      const day = Number(m[3]);
      return new Date(year, month, day);
    }
  }
  return new Date(NaN);
};

export const parseRecentTop5 = <T extends NaverArticle | NaverBlogPost>(articles: T[], cutoff: Date): T[] => {
  return (articles || [])
    .filter(a => {
      const t = getNaverItemDate(a);
      return !Number.isNaN(t.getTime()) && t >= cutoff;
    })
    .sort((a, b) => getNaverItemDate(b).getTime() - getNaverItemDate(a).getTime())
    .slice(0, 5);
};

const pad2 = (num: number) => String(num).padStart(2, '0');

export const formatLabel = (value: string) => {
  const formattedDate = new Date(value);
  if (Number.isNaN(formattedDate.getTime())) return String(value ?? '');
  return `${pad2(formattedDate.getMonth() + 1)}-${pad2(formattedDate.getDate())} ${pad2(
    formattedDate.getHours(),
  )}:${pad2(formattedDate.getMinutes())}`;
};

export const chartTimePeriodMap: Record<GoogleTrendsTimeOptions, string> = {
  'now 1-H': '지난 1시간',
  'now 4-H': '지난 4시간',
  'now 1-d': '지난 1일',
  'now 7-d': '지난 7일',
  'today 1-m': '지난 1개월',
  'today 3-m': '지난 3개월',
  'today 12-m': '지난 12개월',
};
