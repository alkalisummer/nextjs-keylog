import { client } from '@/shared/lib/client';
import { InterestOverTimeRaw, GoogleTrendsTimeOptions } from '../model';

export interface InterestOverTimeProps {
  keyword: string | string[];
  geo: string;
  hl: string;
  period: GoogleTrendsTimeOptions;
}

export const getInterestOverTime = async ({
  keyword,
  geo = 'KR',
  hl = 'ko',
  period = 'now 1-d',
}: InterestOverTimeProps) => {
  const normalizedKeyword = Array.isArray(keyword) ? keyword.join(',') : keyword;
  return await client.route().get<InterestOverTimeRaw>({
    endpoint: '/trend/interestOverTime',
    options: {
      searchParams: { keyword: normalizedKeyword, geo, hl, period },
      isPublic: true,
    },
  });
};
