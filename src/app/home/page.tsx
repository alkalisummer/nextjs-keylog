'use server';

import { Trend } from '@/entities/trends/model';
import { getArticles } from '@/entities/articles/api';
import { getDailyTrends } from '@/entities/trends/api';
import { View } from './ui/View';

export const Page = async () => {
  const dailyTrends = await getDailyTrends({ geo: 'KR', lang: 'ko' });
  dailyTrends.sort((a: Trend, b: Trend) => Number(b.traffic) - Number(a.traffic));

  const firstTrendKeywordInfo = dailyTrends[0];
  const firstTrendKeywordArticles = await getArticles({
    articleKeys: firstTrendKeywordInfo.articleKeys,
    articleCount: 9,
  });

  return <View trends={dailyTrends} articles={firstTrendKeywordArticles} />;
};

export default Page;
