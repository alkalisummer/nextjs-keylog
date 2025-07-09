import { queryKey } from '@/app/provider/query/lib';
import { useQuery } from '@tanstack/react-query';
import { getDailyTrends } from '../api';

interface UseTrendsQueryProps {
  geo: string;
  hl: string;
}

export const useTrendsQuery = ({ geo, hl }: UseTrendsQueryProps) => {
  return useQuery({
    queryKey: queryKey().trend().trendsList(),
    queryFn: () => getDailyTrends({ geo, hl }),
  });
};
