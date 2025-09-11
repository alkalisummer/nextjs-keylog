import { client } from '@/shared/lib/client';
import { InterestOverTime } from '../model';

export interface InterestOverTimeProps {
  keyword: string;
  geo: string;
}

export const getInterestOverTime = async ({ keyword, geo = 'KR' }: InterestOverTimeProps) => {
  return await client.route().post<InterestOverTime>({
    endpoint: '/trend/interestOverTime',
    options: {
      body: { keyword, geo },
      isPublic: true,
    },
  });
};
