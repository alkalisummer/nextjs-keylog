'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';
import css from './googleCharts.module.scss';

interface GoogleChartsProps {
  keywords: string[];
  period: string;
}

export const GoogleCharts = ({ keywords, period }: GoogleChartsProps) => {
  const trendsContainerRef = useRef<HTMLDivElement | null>(null);
  const renderWidget = () => {
    const w = window as any;
    if (!w?.trends?.embed || !trendsContainerRef.current) return;

    trendsContainerRef.current.innerHTML = '';
    w.trends.embed.renderExploreWidgetTo(
      trendsContainerRef.current,
      'TIMESERIES',
      {
        comparisonItem: [...keywords.map(keyword => ({ keyword, geo: 'KR', time: period }))],
        category: 0,
        property: '',
      },
      {
        exploreQuery: `date=${encodeURIComponent(period)}&geo=KR&q=${encodeURIComponent(keywords.join(','))}&hl=ko`,
        guestPath: process.env.NEXT_PUBLIC_GOOGLE_GUEST_PATH,
      },
    );
  };

  useEffect(() => {
    renderWidget();
  }, [keywords, period]);

  return (
    <div className={css.module}>
      <Script src={process.env.NEXT_PUBLIC_GOOGLE_TRENDS_CHARTS} strategy="afterInteractive" onLoad={renderWidget} />
      <div ref={trendsContainerRef} className={css.chart} />
    </div>
  );
};
