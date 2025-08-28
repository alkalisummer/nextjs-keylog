import { client } from '@/shared/lib/client';

export const getRelatedQueries = async (keyword: string) => {
  const result = await client.route().post<string[]>({
    endpoint: '/trend/relatedQueries',
    options: {
      body: { keyword },
    },
  });
  return result.data;
};
