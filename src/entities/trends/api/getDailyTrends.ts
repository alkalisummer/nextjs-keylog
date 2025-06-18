'use server';

import { Trend } from '../model';
import { createDailyTrends } from '../lib/create';
import GoogleTrendsApi from '@alkalisummer/google-trends-js';

interface GetDailyTrendsProps {
  geo: string;
  lang: string;
}

export const getDailyTrends = async ({ geo, lang }: GetDailyTrendsProps): Promise<Trend[]> => {
  const result = await GoogleTrendsApi.dailyTrends({ geo, lang });
  return createDailyTrends(result.data);
};
