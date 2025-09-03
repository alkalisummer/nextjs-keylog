'use client';

import { initTrendData } from '../model';
import { Trend } from '@/entities/trend/model/type';
import { createContext, useContext, useState } from 'react';

interface HomeContextType {
  trend: Trend;
  setTrend: (trend: Trend) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const HomeContext = createContext<HomeContextType | null>(null);

export const HomeContainer = ({
  children,
  initTrend,
  initTab,
}: {
  children: React.ReactNode;
  initTrend: Trend;
  initTab: string;
}) => {
  const [trend, setTrend] = useState<Trend>(initTrend);
  const [selectedTab, setSelectedTab] = useState<string>(initTab);

  const value = {
    trend,
    setTrend,
    selectedTab,
    setSelectedTab,
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
