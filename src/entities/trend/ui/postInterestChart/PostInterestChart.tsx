'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { getInterestOverTime, InterestOverTime } from '../../api/interestOverTimeClient';
import css from './postInterestChart.module.scss';

interface PostInterestChartProps {
  keyword?: string;
}

interface SeriesItem {
  name: string;
  type: string;
  symbol: string;
  sampling: string;
  itemStyle: { color: string };
  data: number[];
}

export function PostInterestChart({ keyword }: PostInterestChartProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [chartData, setChartData] = useState<InterestOverTime | null>(null);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      if (!keyword) {
        setChartData(null);
        return;
      }
      const data = await getInterestOverTime(keyword, 'KR');
      if (!ignore) setChartData(data);
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, [keyword]);

  const option = useMemo(() => {
    if (!chartData) return null;

    const randomColor = () =>
      'rgb(' +
      [Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(',') +
      ')';

    const series: SeriesItem[] = [
      {
        name: chartData.keyword,
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: { color: randomColor() },
        data: chartData.values.map(v => Math.round(v)),
      },
    ];

    return {
      tooltip: { trigger: 'axis' },
      title: { text: '관심도 변화' },
      legend: { data: [chartData.keyword] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: chartData.dates },
      yAxis: { type: 'value' },
      series,
    } as echarts.EChartsCoreOption;
  }, [chartData]);

  useEffect(() => {
    if (!chartRef.current) return;
    let chart = echarts.getInstanceByDom(chartRef.current);
    if (!chart) chart = echarts.init(chartRef.current);
    if (option) {
      chart.setOption(option, true);
    } else {
      chart.clear();
    }
    const onResize = () => chart && chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chart && chart.dispose();
    };
  }, [option]);

  if (!keyword) return null;

  return (
    <div className={css.module}>
      <div className={css.header}>
        <span className={css.title}>Interest Change Chart</span>
      </div>
      <div ref={chartRef} className={css.chart} />
    </div>
  );
}
