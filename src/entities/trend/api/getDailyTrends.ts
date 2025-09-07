import { Trend } from '../model';
import { createDailyTrends } from '../lib/create';
import { ApiResponse } from '@/shared/lib/client';
import GoogleTrendsApi from '@alkalisummer/google-trends-js';

interface GetDailyTrendsProps {
  geo: string;
  hl: string;
}

export const getDailyTrends = async ({ geo, hl }: GetDailyTrendsProps): Promise<ApiResponse<Trend[]>> => {
  try {
    const result = await GoogleTrendsApi.dailyTrends({ geo, hl });
    return {
      ok: true,
      status: 200,
      data: createDailyTrends(result.data || []),
    };
  } catch {
    return {
      ok: false,
      status: 500,
      error: 'Failed to fetch daily trends',
    };
  }
};
