import { Trend } from '../model';
import type { EChartsCoreOption, SeriesOption } from 'echarts';
import type { InterestOverTime } from '../api/interestOverTimeClient';

export const createDailyTrends = (trends: Trend[]) => {
  return trends
    .filter(trend => {
      // 한글이 포함된 키워드만 필터링 (한글 정규식: /[가-힣]/)
      const koreanRegex = /[가-힣]/;
      return koreanRegex.test(trend.keyword);
    })
    .map(
      trend =>
        <Trend>{
          keyword: decodeURIComponent(trend.keyword),
          traffic: trend.traffic,
          trafficGrowthRate: trend.trafficGrowthRate,
          activeTime: trend.activeTime,
          relatedKeywords: trend.relatedKeywords,
          articleKeys: trend.articleKeys,
        },
    ) // traffic 내림 차순 정렬
    .sort((a, b) => Number(b.traffic) - Number(a.traffic))
    .slice(0, 10);
};

export const createSearchGoogleKeyword = (keyword: string) => {
  return `https://www.google.com/search?q=${keyword}`;
};

export const createRgbToString = (s: string) => {
  let hash = 0;
  for (const ch of s) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  const r = (hash >>> 16) & 255,
    g = (hash >>> 8) & 255,
    b = hash & 255;
  return `rgb(${r},${g},${b})`;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U> ? Array<U> : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && Object.prototype.toString.call(value) === '[object Object]';
}

function deepMerge(base: any, override?: any): any {
  if (!override) return base;
  const result: any = { ...base };
  for (const key of Object.keys(override)) {
    const baseValue: any = base[key];
    const overrideValue: any = override[key];
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(baseValue, overrideValue);
    } else if (Array.isArray(overrideValue)) {
      result[key] = overrideValue.slice();
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue;
    }
  }
  return result;
}

export interface CreateChartOptionParams {
  dataList: InterestOverTime[];
  allReady?: boolean;
  seriesType?: string; // e.g., 'line', 'bar'
  smooth?: boolean;
  colorFactory?: (name: string, index: number) => string;
  xAxisBoundaryGap?: boolean;
  tooltip?: EChartsCoreOption['tooltip'];
  legend?: EChartsCoreOption['legend'];
  grid?: EChartsCoreOption['grid'];
  xAxis?: DeepPartial<NonNullable<EChartsCoreOption['xAxis']>>;
  yAxis?: DeepPartial<NonNullable<EChartsCoreOption['yAxis']>>;
  overrides?: DeepPartial<EChartsCoreOption>;
}

export const createChartOption = (params: CreateChartOptionParams): EChartsCoreOption | null => {
  const {
    dataList,
    allReady = true,
    seriesType = 'line',
    smooth = false,
    colorFactory = (name: string) => createRgbToString(name),
    xAxisBoundaryGap,
    tooltip,
    legend,
    grid,
    xAxis,
    yAxis,
    overrides,
  } = params;

  if (!allReady || !Array.isArray(dataList) || dataList.length === 0) return null;

  const series: SeriesOption[] = dataList.map((d, i) => {
    const common = {
      name: d.keyword,
      type: seriesType,
      itemStyle: { color: colorFactory(d.keyword, i) },
      data: d.values.map(v => Math.round(v)),
    } as Record<string, unknown>;

    if (seriesType === 'line') {
      common.symbol = 'none';
      common.sampling = 'lttb';
      common.smooth = smooth;
    }

    return common as SeriesOption;
  });

  const base: EChartsCoreOption = {
    tooltip: deepMerge({ trigger: 'axis' }, tooltip),
    legend: deepMerge({ data: dataList.map(d => d.keyword) }, legend),
    grid: deepMerge({ left: '3%', right: '4%', bottom: '3%', containLabel: true }, grid),
    xAxis: deepMerge(
      { type: 'category', boundaryGap: xAxisBoundaryGap ?? seriesType !== 'line', data: dataList[0].dates },
      xAxis,
    ),
    yAxis: deepMerge({ type: 'value' }, yAxis),
    series,
  };

  return deepMerge(base, overrides);
};
