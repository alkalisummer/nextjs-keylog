'use client';

import { Trend } from '@/entities/trend/model/type';
import { createContext, useContext, useState } from 'react';

interface TrendContextType {
  trend: Trend;
  setTrend: (trend: Trend) => void;
}

const TrendContext = createContext<TrendContextType | null>(null);

export const TrendContainer = ({ children, initialTrend }: { children: React.ReactNode; initialTrend: Trend }) => {
  const [trend, setTrend] = useState<Trend>(initialTrend);

  const value = {
    trend,
    setTrend,
  };

  return <TrendContext.Provider value={value}>{children}</TrendContext.Provider>;
};

export const useTrend = () => {
  const context = useContext(TrendContext);
  if (!context) {
    throw new Error('useTrend must be used within a TrendProvider');
  }
  return context;
};
