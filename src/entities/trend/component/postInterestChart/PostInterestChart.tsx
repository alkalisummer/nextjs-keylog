'use client';

import css from './postInterestChart.module.scss';
import { GoogleTrendsTimeOptions } from '../../model';
import { useInterestOvertimeQuery } from '../../query';
import { ECharts } from '@/shared/lib/echarts/ECharts';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { useMemo, useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createChartOption, parseValidKeywordDataList, formatLabel, chartTimePeriodMap } from '../../lib';

interface PostInterestChartProps {
  keyword: string;
}

export const PostInterestChart = ({ keyword }: PostInterestChartProps) => {
  const addInputRef = useRef<HTMLInputElement | null>(null);
  const [keywords, setKeywords] = useState<string[]>([keyword]);
  const [isAdding, setIsAdding] = useState(false);
  const [period, setPeriod] = useState<GoogleTrendsTimeOptions>('now 1-d');

  useEffect(() => {
    setKeywords([keyword]);
  }, [keyword]);

  const { data: interestOverTimeRes, isError } = useInterestOvertimeQuery({
    keywords,
    geo: 'KR',
    hl: 'ko',
    period,
  });

  if (isError) {
    throw new Error('Interest over time data fetch error');
  }

  const interestOverTimeData = interestOverTimeRes.data;

  const presentDataList = useMemo(() => {
    if (!interestOverTimeData || interestOverTimeData?.values?.length === 0) return [];
    return parseValidKeywordDataList({ interestOverTimeData, keywords });
  }, [keywords, interestOverTimeData]);

  const onChangePeriod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as GoogleTrendsTimeOptions;
    setPeriod(next);
  };

  const option = useMemo(() => {
    return createChartOption({
      dataList: presentDataList,
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
  }, [presentDataList]);

  const onDeleteKeyword = (target: string) => {
    setKeywords(prev => prev.filter(k => k !== target));
  };

  const addComplete = () => {
    setIsAdding(false);
  };

  const onAddKeyword = (value: string) => {
    setIsAdding(true);
    const trimmed = value.trim();
    if (!trimmed) return addComplete();
    setKeywords(prev => {
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
          {keywords.map(k => (
            <span key={k} className={css.keywordItem} title={k} onClick={() => onDeleteKeyword(k)}>
              <span className={css.keyword}>{k}</span>
            </span>
          ))}
          {!isAdding && keywords.length < 5 ? (
            <button className={css.addButton} onClick={() => setIsAdding(true)}>
              + 비교 추가
            </button>
          ) : null}
          {isAdding ? (
            <input
              ref={addInputRef}
              className={css.addInput}
              placeholder="검색어 추가"
              onKeyDown={e => {
                const value = addInputRef.current?.value ?? '';
                if (e.key === 'Enter') onAddKeyword(value);
                if (e.key === 'Escape') addComplete();
              }}
              onBlur={() => addComplete()}
            />
          ) : null}
        </div>
      </div>
      {presentDataList.length > 0 ? (
        <ECharts option={option} className={css.chart} />
      ) : (
        <div className={css.empty}>
          <FontAwesomeIcon icon={faBan} className={css.icon} />
          <span>표시할 데이터가 없습니다.</span>
          <span className={css.desc}>너무 많은 요청으로 인한 원인일 수 있습니다. 잠시후 다시 시도해주세요.</span>
        </div>
      )}
    </div>
  );
};
