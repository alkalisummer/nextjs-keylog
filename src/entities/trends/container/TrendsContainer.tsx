'use client';

import { createContext, useContext, useState } from 'react';
import { Trend } from '@/entities/trends/model/type';
import { initTrend } from './model';

interface TrendContextType {
  trend: Trend;
  setTrend: (trend: Trend) => void;
}

const TrendsContext = createContext<TrendContextType | null>(null);

export const TrendsContainer = ({ children }: { children: React.ReactNode }) => {
  const [trend, setTrend] = useState<Trend>(initTrend());

  const value = {
    trend,
    setTrend,
  };

  return <TrendsContext.Provider value={value}>{children}</TrendsContext.Provider>;
};

export const useTrend = () => {
  const context = useContext(TrendsContext);
  if (!context) {
    throw new Error('useTrends must be used within a TrendsProvider');
  }
  return context;
};
