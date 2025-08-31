'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getInterestOverTime, InterestOverTime } from '../../api/interestOverTimeClient';
import css from './postInterestChart.module.scss';
import { createChartOption } from '../../lib';
import { ECharts } from '@/shared/lib/echarts/ECharts';

interface PostInterestChartProps {
  keyword?: string;
}

// local series type removed; handled by createChartOption

export const PostInterestChart = ({ keyword }: PostInterestChartProps) => {
  const addInputRef = useRef<HTMLInputElement | null>(null);

  const [seriesKeywords, setSeriesKeywords] = useState<string[]>([]);
  const [keywordToDataMap, setKeywordToDataMap] = useState<Record<string, InterestOverTime | null>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [addValue, setAddValue] = useState('');

  useEffect(() => {
    // Reset when base keyword changes
    if (keyword) {
      setSeriesKeywords([keyword]);
      setKeywordToDataMap({});
    } else {
      setSeriesKeywords([]);
      setKeywordToDataMap({});
    }
  }, [keyword]);

  useEffect(() => {
    if (!isAdding) return;
    // focus input when shown
    const id = window.setTimeout(() => addInputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [isAdding]);

  useEffect(() => {
    // Fetch data for any missing keywords
    const missingKeywords = seriesKeywords.filter(k => !keywordToDataMap[k]);
    if (missingKeywords.length === 0) return;

    let cancelled = false;
    const fetchAll = async () => {
      const results = await Promise.all(missingKeywords.map(k => getInterestOverTime(k, 'KR')));
      if (cancelled) return;
      setKeywordToDataMap(prev => {
        const next: Record<string, InterestOverTime | null> = { ...prev };
        missingKeywords.forEach((k, i) => {
          next[k] = results[i] ?? null;
        });
        return next;
      });
    };
    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [seriesKeywords, keywordToDataMap]);

  const presentDataList = useMemo(() => {
    return seriesKeywords
      .map(k => keywordToDataMap[k])
      .filter((d): d is InterestOverTime => !!d && Array.isArray(d.values) && d.values.length > 0);
  }, [seriesKeywords, keywordToDataMap]);

  const allReady = useMemo(() => {
    if (seriesKeywords.length === 0) return false;
    return seriesKeywords.every(k => !!keywordToDataMap[k]);
  }, [seriesKeywords, keywordToDataMap]);

  const option = useMemo(() => {
    return createChartOption({
      dataList: presentDataList,
      allReady,
      seriesType: 'line',
      smooth: false,
      xAxisBoundaryGap: false,
    });
  }, [presentDataList, allReady]);

  const onDeleteKeyword = (target: string) => {
    setSeriesKeywords(prev => prev.filter(k => k !== target));
  };

  const onAddClick = () => {
    setIsAdding(true);
  };

  const finishAdd = () => {
    setIsAdding(false);
    setAddValue('');
  };

  const tryAppendKeyword = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return finishAdd();
    setSeriesKeywords(prev => {
      const exists = prev.some(v => v.toLowerCase() === trimmed.toLowerCase());
      if (exists || prev.length >= 5) return prev;
      return [...prev, trimmed];
    });
    finishAdd();
  };

  if (!keyword) return null;

  return (
    <div className={css.module}>
      <div className={css.header}>
        <div className={css.controls}>
          {seriesKeywords.map(k => (
            <span key={k} className={css.chip} title={k}>
              <span className={css.chipText}>{k}</span>
              <button className={css.chipDelete} aria-label={`remove ${k}`} onClick={() => onDeleteKeyword(k)}>
                ×
              </button>
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
                if (e.key === 'Enter') tryAppendKeyword(addValue);
                if (e.key === 'Escape') finishAdd();
              }}
              onBlur={() => finishAdd()}
            />
          ) : null}
        </div>
      </div>
      <ECharts option={option} className={css.chart} />
    </div>
  );
};
