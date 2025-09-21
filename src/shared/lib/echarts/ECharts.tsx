'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

interface EchartProps {
  option: echarts.EChartsCoreOption | null;
  className: string;
}

export const ECharts = ({ option, className }: EchartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.EChartsType | null>(null);

  // Initialize once on mount
  useEffect(() => {
    if (!chartRef.current) return;
    let chart = echarts.getInstanceByDom(chartRef.current);
    if (!chart) chart = echarts.init(chartRef.current);
    instanceRef.current = chart;
    const onResize = () => chart && chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (instanceRef.current) {
        instanceRef.current.dispose();
        instanceRef.current = null;
      }
    };
  }, []);

  // Update options when changed
  useEffect(() => {
    if (!instanceRef.current || !option) return;
    instanceRef.current.setOption(option, true);
  }, [option]);

  return <div ref={chartRef} className={className} />;
};
