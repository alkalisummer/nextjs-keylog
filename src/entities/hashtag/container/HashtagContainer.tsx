'use client';

import { createContext, useContext, useState } from 'react';

interface HashtagContextType {
  selectedHashtag: number | null;
  setSelectedHashtag: (hashtagId: number | null) => void;
}

const HashtagContext = createContext<HashtagContextType | null>(null);

export const HashtagContainer = ({ children }: { children: React.ReactNode }) => {
  const [selectedHashtag, setSelectedHashtag] = useState<number | null>(null);

  const value = {
    selectedHashtag,
    setSelectedHashtag,
  };

  return <HashtagContext.Provider value={value}>{children}</HashtagContext.Provider>;
};

export const useHashtag = () => {
  const context = useContext(HashtagContext);
  if (!context) {
    throw new Error('useHashtag must be used within a HashtagProvider');
  }
  return context;
};
