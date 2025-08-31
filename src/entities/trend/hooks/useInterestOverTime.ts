import { useEffect, Dispatch, SetStateAction } from 'react';
import { getInterestOverTime, InterestOverTime } from '@/entities/trend/api/interestOverTimeClient';

interface UseInterestOverTimeParams {
  seriesKeywords: string[];
  keywordToDataMap: Record<string, InterestOverTime>;
  setKeywordToDataMap: Dispatch<SetStateAction<Record<string, InterestOverTime>>>;
  geo?: string;
}

export const useInterestOverTime = ({
  seriesKeywords,
  keywordToDataMap,
  setKeywordToDataMap,
  geo = 'KR',
}: UseInterestOverTimeParams) => {
  useEffect(() => {
    const missingKeywords = seriesKeywords.filter(keyword => !keywordToDataMap[keyword]);
    if (missingKeywords.length === 0) return;

    const fetchAll = async () => {
      const results = await Promise.all(missingKeywords.map(keyword => getInterestOverTime(keyword, geo)));
      const validResults = results.filter(result => result.ok);
      setKeywordToDataMap(prev => {
        const next: Record<string, InterestOverTime> = { ...prev };
        missingKeywords.forEach((keyword, index) => {
          next[keyword] = validResults[index].data;
        });
        return next;
      });
    };
    fetchAll();
  }, [seriesKeywords, keywordToDataMap, setKeywordToDataMap, geo]);
};
