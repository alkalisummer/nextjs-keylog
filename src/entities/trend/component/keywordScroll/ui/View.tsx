'use client';

import css from './view.module.scss';
import { Trend } from '../../../model';
import { useHome } from '@/app/home/container';
import { useAutoplaySpeed } from '../../../hooks';
import { InfiniteScroll } from '@/shared/lib/reactBits';
import { parseKeywordsArray } from '../../../lib/transform';
import { KeywordList } from '../../keywordList/KeywordList';
import { useCallback, useMemo, useState } from 'react';
import { useKeywordItemClick, useRefreshDailyTrends } from '../../../hooks';

interface Props {
  trends: Trend[];
}

export const View = ({ trends }: Props) => {
  const { trend, setTrend, selectedTab } = useHome();
  const autoplaySpeed = useAutoplaySpeed();
  const [data, setData] = useState<Trend[]>(trends);

  const items = useMemo(() => {
    const trendItems = parseKeywordsArray(data);
    const keywordList = <KeywordList trends={data} setSelectedTrend={setTrend || (() => {})} />;
    return [{ content: keywordList }, ...trendItems];
  }, [data, setTrend]);

  const handleItemClick = useKeywordItemClick(setTrend);

  const { refresh } = useRefreshDailyTrends({
    currentSelected: trend,
    setSelected: setTrend,
  });

  const refreshAndSet = useCallback(async () => {
    const next = await refresh();
    if (Array.isArray(next)) setData(next);
  }, [refresh]);

  if (selectedTab === 'post') return;

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
          refresh={refreshAndSet}
        />
      </div>
    </section>
  );
};
