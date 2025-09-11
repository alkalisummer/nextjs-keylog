import { useCallback } from 'react';
import { Trend } from '../model';

export const useKeywordItemClick = (setTrend?: (trend: Trend) => void) => {
  return useCallback(
    (data: Trend) => {
      if (data) {
        setTrend?.(data);
      }
    },
    [setTrend],
  );
};
