import { InterestOverTime, GoogleTrendsTimeOptions } from '../model';
import { useEffect, Dispatch, SetStateAction } from 'react';
import { getInterestOverTime } from '@/entities/trend/api/getInterestOverTime';

interface UseInterestOverTimeParams {
  seriesKeywords: string[];
  keywordToDataMap: Record<string, InterestOverTime>;
  setKeywordToDataMap: Dispatch<SetStateAction<Record<string, InterestOverTime>>>;
  geo?: string;
  hl?: string;
  period?: GoogleTrendsTimeOptions;
}

export const useInterestOverTime = ({
  seriesKeywords,
  keywordToDataMap,
  setKeywordToDataMap,
  geo = 'KR',
  hl = 'ko',
  period = 'now 1-d',
}: UseInterestOverTimeParams) => {
  useEffect(() => {
    const missingKeywords = seriesKeywords.filter(k => !keywordToDataMap[k]);
    if (missingKeywords.length === 0) return;

    let cancelled = false;
    (async () => {
      const pairs = await Promise.all(
        missingKeywords.map(async keyword => {
          const res = await getInterestOverTime({ keyword, geo, hl, period });
          return { keyword, res };
        }),
      );

      if (cancelled) return;

      setKeywordToDataMap(prev => {
        const next = { ...prev };
        for (const { keyword, res } of pairs) {
          if (res.ok) next[keyword] = res.data;
        }
        return next;
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [seriesKeywords, geo, hl, period]);
};
