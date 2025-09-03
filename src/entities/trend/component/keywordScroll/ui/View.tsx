'use client';

import css from './view.module.scss';
import { Trend } from '../../../model';
import { useHome } from '@/app/home/container';
import { useAutoplaySpeed } from '../../../hooks';
import { InfiniteScroll } from '@/shared/lib/reactBits';
import { parseKeywordsArray } from '../../../lib/transform';
import { KeywordList } from '../../keywordList/KeywordList';

interface Props {
  trends: Trend[];
}

export const View = ({ trends }: Props) => {
  const { trend, setTrend, selectedTab } = useHome();
  const autoplaySpeed = useAutoplaySpeed();

  if (selectedTab === 'post') return;

  const trendItems = parseKeywordsArray(trends);
  const keywordList = <KeywordList trends={trends} setSelectedTrend={setTrend || (() => {})} />;

  // components가 있는 경우 앞에 추가
  const items = [{ content: keywordList }, ...trendItems];

  const handleItemClick = (data?: any) => {
    // data가 Trend 객체인 경우에만 onClick 호출
    if (data && typeof data === 'object' && 'keyword' in data) {
      setTrend?.(data as Trend);
    }
  };

  return (
    <section className={css.module}>
      <div className={css.keywordScroll}>
        <InfiniteScroll
          items={items}
          selectedItemInitData={trend}
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
