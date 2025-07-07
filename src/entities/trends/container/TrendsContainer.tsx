'use client';

import { Trend } from '@/entities/trends/model/type';
import { createContext, useContext, useState } from 'react';

interface TrendContextType {
  trend: Trend;
  setTrend: (trend: Trend) => void;
}

const TrendsContext = createContext<TrendContextType | null>(null);

export const TrendsContainer = ({ children, initialTrend }: { children: React.ReactNode; initialTrend: Trend }) => {
  const [trend, setTrend] = useState<Trend>(initialTrend);

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
