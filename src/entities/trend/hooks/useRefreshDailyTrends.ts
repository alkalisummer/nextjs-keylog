import { useCallback, useState } from 'react';
import { Trend } from '../model';
import { getDailyTrends } from '../api';

interface UseRefreshDailyTrendsParams {
  currentSelected?: Trend | null;
  setSelected?: (trend: Trend) => void;
  geo?: string;
  hl?: string;
}

export const useRefreshDailyTrends = ({
  currentSelected,
  setSelected,
  geo = 'KR',
  hl = 'ko',
}: UseRefreshDailyTrendsParams = {}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const res = await getDailyTrends({ geo, hl });
      if (res.ok && Array.isArray(res.data)) {
        const trends = res.data;
        const matched = trends.find(trend => trend.keyword === currentSelected?.keyword);
        if (setSelected) {
          setSelected(matched || trends[0]);
        }
        return trends;
      }
      return undefined;
    } finally {
      setIsRefreshing(false);
    }
  }, [currentSelected?.keyword, geo, hl, isRefreshing, setSelected]);

  return { isRefreshing, refresh } as const;
};
