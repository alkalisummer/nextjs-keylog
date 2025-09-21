'use client';

import { GoogleTrendsTimeOptions } from '../model';
import { queryKey } from '@/app/provider/query/lib';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getInterestOverTime } from '@/entities/trend/api/getInterestOverTime';

interface UseInterestOverTimeParams {
  keywords: string[];
  geo?: string;
  hl?: string;
  period?: GoogleTrendsTimeOptions;
}

export const useInterestOvertimeQuery = ({
  keywords,
  geo = 'KR',
  hl = 'ko',
  period = 'now 1-d',
}: UseInterestOverTimeParams) => {
  return useSuspenseQuery({
    queryKey: queryKey().trend().interestOverTime({ keywords, geo, hl, period }),
    queryFn: () => getInterestOverTime({ keyword: keywords, geo, hl, period }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
