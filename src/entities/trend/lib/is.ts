import { InterestOverTime } from '../api/interestOverTimeClient';

export const isAllReady = (seriesKeywords: string[], keywordToDataMap: Record<string, InterestOverTime>) => {
  return seriesKeywords.every(k => {
    const keywordData = keywordToDataMap[k];
    return !!keywordData && Array.isArray(keywordData.values) && keywordData.values.length > 0;
  });
};
