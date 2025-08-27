'use server';

import { Trend } from '../model';
import { createDailyTrends } from '../lib/create';
import GoogleTrendsApi from '@alkalisummer/google-trends-js';

interface GetDailyTrendsProps {
  geo: string;
  hl: string;
}

export const getDailyTrends = async ({ geo, hl }: GetDailyTrendsProps): Promise<Trend[]> => {
  const result = await GoogleTrendsApi.dailyTrends({ geo, hl });
  return createDailyTrends(result.data || []);
};
