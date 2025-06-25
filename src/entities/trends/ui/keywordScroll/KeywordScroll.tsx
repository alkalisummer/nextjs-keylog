'use client';

import { JSX } from 'react';
import { Trend } from '../../model';
import { InfiniteScroll } from '@/shared/ui';
import css from './keywordScroll.module.scss';
import { parseKeywordsArray } from '../../lib/transform';
import { useAutoplaySpeed } from '../../hook';

interface KeywordScrollProps {
  trends: Trend[];
  components?: JSX.Element[];
  customSpeeds?: {
    desktop?: number;
    tablet?: number;
    mobile?: number;
  };
  onClick?: (trend: Trend) => void;
}

export const KeywordScroll = ({ trends, components, customSpeeds, onClick }: KeywordScrollProps) => {
  const trendItems = parseKeywordsArray(trends);
  const autoplaySpeed = useAutoplaySpeed(customSpeeds);

  // components가 있는 경우 앞에 추가
  const items =
    components && components.length > 0
      ? [...components.map(component => ({ content: component })), ...trendItems]
      : trendItems;

  const handleItemClick = (data?: any) => {
    // data가 Trend 객체인 경우에만 onClick 호출
    if (data && typeof data === 'object' && 'keyword' in data) {
      onClick?.(data as Trend);
    }
  };

  return (
    <div className={css.module}>
      <div className={css.keywordScroll}>
        <InfiniteScroll
          items={items}
          autoplay={true}
          autoplayDirection="up"
          autoplaySpeed={autoplaySpeed}
          isTilted={true}
          pauseOnHover={true}
          width="100%"
          negativeMargin="-2.5em"
          onClick={handleItemClick}
        />
      </div>
    </div>
  );
};
