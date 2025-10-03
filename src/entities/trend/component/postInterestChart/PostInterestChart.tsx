'use client';

import { chartTimePeriodMap } from '../../lib';
import css from './postInterestChart.module.scss';
import { useRef, useState, useEffect } from 'react';
import { GoogleTrendsTimeOptions } from '../../model';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GoogleCharts } from '@/shared/lib/googleCharts/GoogleCharts';

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

  const onChangePeriod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as GoogleTrendsTimeOptions;
    setPeriod(next);
  };

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
      <GoogleCharts keywords={keywords} period={period} />
    </div>
  );
};
