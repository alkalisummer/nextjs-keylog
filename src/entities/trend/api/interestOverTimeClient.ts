import { client } from '@/shared/lib/client';

export interface InterestOverTime {
  keyword: string;
  dates: string[];
  values: number[];
}

export const getInterestOverTime = async (keyword: string, geo: string = 'KR') => {
  const result = await client.route().post<InterestOverTime | null>({
    endpoint: '/trend/interestOverTime',
    options: {
      body: { keyword, geo },
    },
  });
  return result.data;
};
