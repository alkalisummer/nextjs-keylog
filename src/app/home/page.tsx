'use server';

import { View } from './ui/View';
import { getArticles } from '@/entities/articles/api';
import { getDailyTrends } from '@/entities/trends/api';
import { NUMBER_CONSTANTS } from '@/shared/lib/constants';
import { TrendsProvider } from '@/entities/trends/container/TrendsContainer';

export const Page = async () => {
  const dailyTrends = await getDailyTrends({ geo: 'KR', lang: 'ko' });

  const firstTrendKeywordInfo = dailyTrends[0];
  const firstTrendKeywordArticles = await getArticles({
    articleKeys: firstTrendKeywordInfo.articleKeys,
    articleCount: NUMBER_CONSTANTS.ARTICLE_COUNT,
  });

  return (
    <TrendsProvider>
      <View trends={dailyTrends} initialArticles={firstTrendKeywordArticles} />
    </TrendsProvider>
  );
};

export default Page;
