'use client';

import { createContext, useContext, useState } from 'react';

interface BlogContextType {
  selectedHashtag: number | null;
  setSelectedHashtag: (hashtagId: number | null) => void;
}

const BlogContext = createContext<BlogContextType | null>(null);

export const BlogContainer = ({ children }: { children: React.ReactNode }) => {
  const [selectedHashtag, setSelectedHashtag] = useState<number | null>(null);

  const value = {
    selectedHashtag,
    setSelectedHashtag,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
