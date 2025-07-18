'use client';

import { Trend } from '@/entities/trend/model/type';
import { createContext, useContext, useState } from 'react';

interface HomeContextType {
  trend: Trend;
  setTrend: (trend: Trend) => void;
}

const HomeContext = createContext<HomeContextType | null>(null);

export const HomeContainer = ({ children, initialTrend }: { children: React.ReactNode; initialTrend: Trend }) => {
  const [trend, setTrend] = useState<Trend>(initialTrend);

  const value = {
    trend,
    setTrend,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};
