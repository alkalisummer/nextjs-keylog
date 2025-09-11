import { Trend } from '../model';
import { client } from '@/shared/lib/client';
import { ApiResponse } from '@/shared/lib/client';

interface GetDailyTrendsProps {
  geo: string;
  hl: string;
}

export const getDailyTrends = async ({ geo, hl }: GetDailyTrendsProps): Promise<ApiResponse<Trend[]>> => {
  return await client.route().get<Trend[]>({
    endpoint: '/trend/dailyTrends',
    options: { searchParams: { geo, hl }, isPublic: true },
  });
};

export const getDailyTrendsServer = getDailyTrends;
