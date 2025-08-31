import { client } from '@/shared/lib/client';

export interface InterestOverTime {
  keyword: string;
  dates: string[];
  values: number[];
}

export const getInterestOverTime = async (keyword: string, geo: string = 'KR') => {
  return await client.route().post<InterestOverTime>({
    endpoint: '/trend/interestOverTime',
    options: {
      body: { keyword, geo },
    },
  });
};
