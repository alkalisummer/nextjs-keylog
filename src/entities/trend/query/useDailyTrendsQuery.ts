'use client';

import { getDailyTrends } from '../api';
import { queryKey } from '@/app/provider/query/lib';
import { useSuspenseQuery } from '@tanstack/react-query';

interface UseDailyTrendsQueryProps {
  geo: string;
  hl: string;
}

export const useDailyTrendsQuery = ({ geo = 'KR', hl = 'ko' }: UseDailyTrendsQueryProps) => {
  return useSuspenseQuery({
    queryKey: queryKey().trend().trendsList(),
    queryFn: () => getDailyTrends({ geo, hl }),
  });
};
