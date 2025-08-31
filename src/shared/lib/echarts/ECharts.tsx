'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

interface EchartProps {
  option: echarts.EChartsCoreOption | null;
  className: string;
}

export const ECharts = ({ option, className }: EchartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    let chart = echarts.getInstanceByDom(chartRef.current);
    if (!chart) chart = echarts.init(chartRef.current);
    if (option) chart.setOption(option, true);
    const onResize = () => chart && chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chart && chart.dispose();
    };
  }, [option]);

  return <div ref={chartRef} className={className} />;
};
