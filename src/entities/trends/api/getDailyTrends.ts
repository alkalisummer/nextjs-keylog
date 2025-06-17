import GoogleTrendsApi from '@alkalisummer/google-trends-js';

export const getDailyTrends = async (lang: string) => {
  const dailyTrends = await GoogleTrendsApi.dailyTrends({ geo: 'KR', lang });
  return dailyTrends;
};
