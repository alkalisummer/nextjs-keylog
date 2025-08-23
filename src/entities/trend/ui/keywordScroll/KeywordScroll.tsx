'use client';

import { Trend } from '../../model';
import css from './keywordScroll.module.scss';
import { useAutoplaySpeed } from '../../hooks';
import { InfiniteScroll } from '@/shared/lib/reactBits';
import { parseKeywordsArray } from '../../lib/transform';
import { KeywordList } from '../keywordList/KeywordList';

interface KeywordScrollProps {
  trends: Trend[];
  selectedTrend: Trend;
  customSpeeds?: {
    desktop?: number;
    tablet?: number;
    mobile?: number;
  };
  onClick?: (trend: Trend) => void;
}

export const KeywordScroll = ({ trends, selectedTrend, customSpeeds, onClick }: KeywordScrollProps) => {
  const autoplaySpeed = useAutoplaySpeed(customSpeeds);
  const trendItems = parseKeywordsArray(trends);
  const keywordList = <KeywordList trends={trends} setSelectedTrend={onClick || (() => {})} />;

  // components가 있는 경우 앞에 추가
  const items = [{ content: keywordList }, ...trendItems];

  const handleItemClick = (data?: any) => {
    // data가 Trend 객체인 경우에만 onClick 호출
    if (data && typeof data === 'object' && 'keyword' in data) {
      onClick?.(data as Trend);
    }
  };

  return (
    <section className={css.module}>
      <div className={css.keywordScroll}>
        <InfiniteScroll
          items={items}
          selectedItemInitData={selectedTrend}
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
    </section>
  );
};
