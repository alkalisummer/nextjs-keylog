'use client';

import { useInterestOverTime } from '../../hooks';
import css from './postInterestChart.module.scss';
import { ECharts } from '@/shared/lib/echarts/ECharts';
import { useEffect, useMemo, useRef, useState } from 'react';
import { InterestOverTime, GoogleTrendsTimeOptions } from '../../model';
import { createChartOption, isAllReady, parseValidKeywordDataList, formatLabel, chartTimePeriodMap } from '../../lib';

interface PostInterestChartProps {
  keyword: string;
}

export const PostInterestChart = ({ keyword }: PostInterestChartProps) => {
  const addInputRef = useRef<HTMLInputElement | null>(null);

  const [seriesKeywords, setSeriesKeywords] = useState<string[]>([keyword]);
  const [keywordToDataMap, setKeywordToDataMap] = useState<Record<string, InterestOverTime>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [addValue, setAddValue] = useState('');
  const [period, setPeriod] = useState<GoogleTrendsTimeOptions>('now 1-d');

  useEffect(() => {
    setSeriesKeywords([keyword]);
  }, [keyword]);

  useEffect(() => {
    if (!isAdding) return;
    const id = window.setTimeout(() => addInputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [isAdding]);

  useInterestOverTime({
    seriesKeywords,
    keywordToDataMap,
    setKeywordToDataMap,
    geo: 'KR',
    hl: 'ko',
    period,
  });

  const onChangePeriod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as GoogleTrendsTimeOptions;
    setPeriod(next);
    setKeywordToDataMap({});
  };

  const presentDataList = useMemo(() => {
    return parseValidKeywordDataList(keywordToDataMap, seriesKeywords);
  }, [seriesKeywords, keywordToDataMap]);

  const allReady = useMemo(() => {
    if (seriesKeywords.length === 0) return false;
    return isAllReady(seriesKeywords, keywordToDataMap);
  }, [seriesKeywords, keywordToDataMap]);

  const option = useMemo(() => {
    return createChartOption({
      dataList: presentDataList,
      allReady,
      seriesType: 'line',
      smooth: true,
      xAxisBoundaryGap: false,
      tooltip: {
        show: true,
      },
      xAxis: {
        axisLabel: { formatter: (val: string) => formatLabel(val) },
        axisPointer: {
          label: {
            formatter: (obj: { value: string }) => {
              return formatLabel(String(obj.value ?? ''));
            },
          },
        },
      },
    });
  }, [presentDataList, allReady]);

  const onDeleteKeyword = (target: string) => {
    setSeriesKeywords(prev => prev.filter(k => k !== target));
  };

  const onAddClick = () => {
    setIsAdding(true);
  };

  const addComplete = () => {
    setIsAdding(false);
    setAddValue('');
  };

  const addKeyword = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return addComplete();
    setSeriesKeywords(prev => {
      const exists = prev.some(v => v.toLowerCase() === trimmed.toLowerCase());

      if (exists) {
        return prev;
      }

      if (prev.length >= 5) {
        alert('키워드는 최대 5개까지 비교할 수 있습니다.');
        return prev;
      }

      return [...prev, trimmed];
    });
    addComplete();
  };

  if (!keyword) return null;

  return (
    <div className={css.module}>
      <div className={css.periodDropdown}>
        <select value={period} onChange={onChangePeriod}>
          {Object.entries(chartTimePeriodMap).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className={css.header}>
        <div className={css.controls}>
          {seriesKeywords.map(k => (
            <span key={k} className={css.keywordItem} title={k} onClick={() => onDeleteKeyword(k)}>
              <span className={css.keyword}>{k}</span>
            </span>
          ))}
          {!isAdding && seriesKeywords.length < 5 ? (
            <button className={css.addButton} onClick={onAddClick}>
              + 비교 추가
            </button>
          ) : null}
          {isAdding ? (
            <input
              ref={addInputRef}
              className={css.addInput}
              placeholder="검색어 추가"
              value={addValue}
              onChange={e => setAddValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') addKeyword(addValue);
                if (e.key === 'Escape') addComplete();
              }}
              onBlur={() => addComplete()}
            />
          ) : null}
        </div>
      </div>
      <ECharts option={option} className={css.chart} />
    </div>
  );
};
