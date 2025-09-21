import { client } from '@/shared/lib/client';
import { InterestOverTime, GoogleTrendsTimeOptions } from '../model';

export interface InterestOverTimeProps {
  keyword: string;
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
  return await client.route().get<InterestOverTime>({
    endpoint: '/trend/interestOverTime',
    options: {
      searchParams: { keyword, geo, hl, period },
      isPublic: true,
    },
  });
};
